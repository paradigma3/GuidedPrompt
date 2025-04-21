const { v4: uuidv4 } = require("uuid");
const { getVectorDbClass, getLLMProvider, getFaqNamespace } = require("../helpers");
const { chatPrompt, sourceIdentifier } = require("./index");
const { EmbedChats } = require("../../models/embedChats");
const {
  convertToPromptHistory,
  writeResponseChunk,
} = require("../helpers/chat/responses");
const { DocumentManager } = require("../DocumentManager");
const prisma = require("../prisma");
const { FAQ } = require("../../models/faq");
const { processChatWithVectorSearch } = require("./processChat");

async function streamChatWithForEmbed(response, params) {
  console.log('[streamChatWithForEmbed] Starting with params:', {
    hasConnection: !!response?.locals?.connection,
    connection: response?.locals?.connection,
    sessionId: params?.sessionId || arguments[3], // handle both param styles
  });

  console.log('PARAMS:', params);
  console.log('response:', response.body);

  // Check if we're being called with separate parameters (response, embed, message, sessionId, options)
  // or with just (response, params)
  let embed, message, sessionId, options = {};

  if (params.uuid) {
    // This is the embed config object, use it directly
    embed = params;

    // Check if we have additional parameters (message, sessionId, options)
    if (arguments.length > 2) {
      message = arguments[2];
      sessionId = arguments[3];
      options = arguments[4] || {};
      console.log('Using separate parameters:');
      console.log('Message:', message);
      console.log('SessionId:', sessionId);
      console.log('Options:', options);
    } else {
      // Try to extract message from params
      const { message: paramMessage, history = [] } = params;
      message = paramMessage;
      console.log('Extracted message from params:', message);
      console.log('History:', history);
    }
  } else {
    // This is the expected params object with embedId
    const { message: paramMessage, embedId, history = [] } = params;
    message = paramMessage;
    console.log('Extracted embedId:', embedId);
    console.log('Extracted message:', message);
    console.log('Extracted history:', history);

    // Find the embed configuration using UUID
    console.log('Attempting to find embed config with UUID:', embedId);
    embed = await prisma.embed_configs.findUnique({
      where: { uuid: embedId },
      include: { workspace: true }
    });
    console.log('Found embed config:', embed ? JSON.stringify(embed, null, 2) : 'null');

    if (!embed) {
      console.log('No embed config found for UUID:', embedId);
      writeResponseChunk(response, {
        id: uuidv4(),
        type: "abort",
        textResponse: "Embed configuration not found",
        sources: [],
        close: true,
        error: "Embed configuration not found"
      });
      return;
    }
  }

  const uuid = uuidv4();

  // Get the vector database provider
  const VectorDb = getVectorDbClass();

  // Get the document namespace for RAG
  const documentNamespace = embed.workspace.slug;

  // Check if we have vectorized data for documents
  const hasData = await VectorDb.hasNamespace(documentNamespace);
  const vectorCount = hasData ? await VectorDb.namespaceCount(documentNamespace) : 0;
  console.log('Vectorized space:', documentNamespace, 'has data:', hasData, 'count:', vectorCount);

  try {
    // Get relevant FAQs for suggestions and widgets using the numeric ID
    console.log('Fetching FAQs for embed ID:', embed.id);
    const faqs = await FAQ.getEmbeddings(embed.id);
    console.log('Found FAQs:', faqs.length);

    let mostRelevantFaq = null;
    let highestSimilarity = 0;

    if (faqs.length > 0) {
      // Get the LLM connector for embedding
      const LLMConnector = getLLMProvider();
      // Ensure message is a string and not empty
      const messageToEmbed = typeof message === 'string' && message.trim() ? message : "Default message";
      console.log('Message to embed:', messageToEmbed);
      const messageEmbedding = await LLMConnector.embedTextInput(messageToEmbed);
      console.log('Generated message embedding');

      // Get the FAQ namespace
      const faqNamespace = getFaqNamespace(embed.id);
      console.log('Using FAQ namespace:', faqNamespace);

      // Search for relevant FAQs using vector database
      const searchResults = await VectorDb.searchFaqs({
        namespace: faqNamespace,
        queryVector: messageEmbedding,
        similarityThreshold: 0.3,
        topN: 1
      });
      console.log('FAQ search results:', searchResults);
      if (searchResults.sourceDocuments.length > 0) {
        mostRelevantFaq = searchResults.sourceDocuments[0];
        highestSimilarity = searchResults.scores[0];
        console.log('Most relevant FAQ similarity:', highestSimilarity);
      }
    }

    // Get suggestions and widgets for the most relevant FAQ
    let faqSuggestions = [];
    let faqWidgets = [];
    let faqContext = "";

    if (mostRelevantFaq) {
      console.log('Fetching details for most relevant FAQ:', mostRelevantFaq.faq_id);
      const faqDetails = await prisma.FAQ.findUnique({
        where: { id: mostRelevantFaq.faq_id },
        include: {
          suggestions: true,
          widgets: true
        }
      });
      console.log('FAQ details:', faqDetails ? JSON.stringify(faqDetails, null, 2) : 'null');

      if (faqDetails?.suggestions) {
        faqSuggestions = faqDetails.suggestions;
      }
      if (faqDetails?.widgets) {
        faqWidgets = faqDetails.widgets;
      }

      // Add FAQ content as context
      if (faqDetails) {
        faqContext = `FAQ Question: ${faqDetails.question}\n`;
        console.log('Added FAQ context:', faqContext);
      }
    }

    // Get the LLM provider
    const LLMConnector = getLLMProvider({
      provider: embed.workspace?.chatProvider,
      model: embed.workspace?.chatModel,
    });

    // Get vector search results for documents
    let sources = [];
    let contextTexts = [];

    if (hasData && vectorCount > 0) {
      // Search for relevant documents using performSimilaritySearch
      const searchResults = await VectorDb.performSimilaritySearch({
        namespace: documentNamespace,
        input: message,
        LLMConnector,
        similarityThreshold: 0.25,
        topN: 5
      });

      if (searchResults.contextTexts.length > 0) {
        contextTexts = searchResults.contextTexts;
        sources = searchResults.sources;
      }
    }

    // Get chat history
    const { chatHistory } = await recentEmbedChatHistory(sessionId, embed, 20);

    // Construct the prompt with the relevant context
    const prompt = chatPrompt(embed.workspace);
    const context = contextTexts.join("\n\n");

    // Combine document context with FAQ context
    const combinedContext = faqContext
      ? `${context}\n\n${faqContext}`
      : context;

    // Prepare messages for the LLM
    const messages = [
      { role: "system", content: prompt },
      ...chatHistory,
      { role: "user", content: `Context:\n${combinedContext}\n\nQuestion: ${message}` }
    ];

    // Check if streaming is enabled for the LLM connector
    if (LLMConnector.streamingEnabled() !== true) {
      console.log(
        `\x1b[31m[STREAMING DISABLED]\x1b[0m Streaming is not available for ${LLMConnector.constructor.name}. Will use regular chat method.`
      );
      const { textResponse, metrics: performanceMetrics } =
        await LLMConnector.getChatCompletion(messages, {
          temperature: embed.workspace?.openAiTemp ?? LLMConnector.defaultTemp,
        });

      // Write the response chunk
      writeResponseChunk(response, {
        id: uuid,
        type: "textResponseChunk",
        textResponse,
        sources: [],
        close: true,
        error: false,
        metrics: performanceMetrics,
      });

      // Write finalize response
      writeResponseChunk(response, {
        id: uuid,
        type: "finalizeResponseStream",
        close: true,
        error: false,
        metrics: performanceMetrics,
        suggestions: faqSuggestions,
        widgets: faqWidgets
      });

      // Save the chat to the database with suggestions and widgets
      // Include username in connection_information if available
      const connectionInfo = response?.locals?.connection || {};
      if (options.username) {
        connectionInfo.username = options.username;
      }

      await EmbedChats.new({
        embedId: embed.id,
        sessionId,
        prompt: message,
        response: {
          text: textResponse,
          sources,
          type: "chat",
          suggestions: faqSuggestions,
          widgets: faqWidgets
        },
        connection_information: connectionInfo,
        user: options.username || null,
      });
    } else {
      // Use streaming for the response
      const stream = await LLMConnector.streamGetChatCompletion(messages, {
        temperature: embed.workspace?.openAiTemp ?? LLMConnector.defaultTemp,
      });

      // Handle the stream and write chunks as they come in
      // Pass empty sources array to prevent sources from being included in the streaming response
      const completeText = await LLMConnector.handleStream(response, stream, {
        uuid,
        sources: [], // Don't include sources in the streaming response
      });

      // Write finalize response with metrics
      writeResponseChunk(response, {
        id: uuid,
        type: "finalizeResponseStream",
        close: true,
        error: false,
        metrics: stream.metrics,
        suggestions: faqSuggestions,
        widgets: faqWidgets
      });

      // Save the chat to the database with suggestions and widgets
      if (completeText?.length > 0) {
        console.log('[streamChatWithForEmbed] Saving chat with connection:', {
          connection: response?.locals?.connection,
          sessionId: sessionId
        });

        // Include username in connection_information if available
        const connectionInfo = response?.locals?.connection || {};
        if (options.username) {
          connectionInfo.username = options.username;
        }

        await EmbedChats.new({
          embedId: embed.id,
          sessionId,
          prompt: message,
          response: {
            text: completeText,
            sources,
            type: "chat",
            suggestions: faqSuggestions,
            widgets: faqWidgets
          },
          connection_information: connectionInfo,
          user: options.username || null,
        });
      }
    }
  } catch (error) {
    console.error("Error in streamChatWithForEmbed:", error);
    writeResponseChunk(response, {
      id: uuid,
      type: "abort",
      textResponse: "An error occurred while processing your request",
      sources: [],
      close: true,
      error: error.message
    });
  }
}

/**
 * @param {string} sessionId the session id of the user from embed widget
 * @param {Object} embed the embed config object
 * @param {Number} messageLimit the number of messages to return
 * @returns {Promise<{rawHistory: import("@prisma/client").embed_chats[], chatHistory: {role: string, content: string, attachments?: Object[]}[]}>
 */
async function recentEmbedChatHistory(sessionId, embed, messageLimit = 20) {
  const rawHistory = (
    await EmbedChats.forEmbedByUser(embed.id, sessionId, messageLimit, {
      id: "desc",
    })
  ).reverse();
  return { rawHistory, chatHistory: convertToPromptHistory(rawHistory) };
}

module.exports = {
  streamChatWithForEmbed,
};
