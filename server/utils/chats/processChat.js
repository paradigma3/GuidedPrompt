const { getVectorDbClass, getLLMProvider } = require("../helpers");
const { chatPrompt } = require("./index");

/**
 * Process a chat message with vector search to find relevant context
 * @param {string} message - The user's message
 * @param {Object} embed - The embed configuration
 * @param {Object} options - Additional options
 * @param {Array} options.history - Chat history
 * @returns {Promise<{textResponse: string, sources: Array}>}
 */
async function processChatWithVectorSearch(message, embed, options = {}) {
  const { history = [] } = options;
  const VectorDb = getVectorDbClass();
  const LLM = getLLMProvider();

  // Use the workspace slug as the namespace
  const namespace = embed.workspace.slug;

  // Get vectorized space and embeddings count
  const hasVectorizedSpace = await VectorDb.hasNamespace(namespace);
  const embeddingsCount = await VectorDb.namespaceCount(namespace);

  if (!hasVectorizedSpace || embeddingsCount === 0) {
    // If no vectorized data, just return a basic response
    return {
      textResponse: "I don't have enough information to answer your question. Please contact the administrator.",
      sources: []
    };
  }

  try {
    // Generate embedding for the message using the LLM connector
    const messageEmbedding = await LLM.embedTextInput(message);

    // Search for relevant documents using performSimilaritySearch
    const searchResults = await VectorDb.performSimilaritySearch({
      namespace,
      input: message,
      LLMConnector: LLM,
      similarityThreshold: 0.25,
      topN: 5
    });

    // If no relevant documents found, return a basic response
    if (!searchResults.contextTexts.length) {
      return {
        textResponse: "I couldn't find any relevant information to answer your question. Please try rephrasing or contact the administrator.",
        sources: []
      };
    }

    // Construct the prompt with the relevant context
    const prompt = chatPrompt(embed.workspace);
    const context = searchResults.contextTexts.join("\n\n");

    // Generate a response using the LLM
    const response = await LLM.getChatCompletion([
      { role: "system", content: prompt },
      ...history,
      { role: "user", content: `Context:\n${context}\n\nQuestion: ${message}` }
    ], { temperature: 0.7 });

    return {
      textResponse: response.textResponse,
      sources: searchResults.sources
    };
  } catch (error) {
    console.error("Error in processChatWithVectorSearch:", error);
    return {
      textResponse: "An error occurred while processing your request. Please try again later.",
      sources: []
    };
  }
}

module.exports = {
  processChatWithVectorSearch
};