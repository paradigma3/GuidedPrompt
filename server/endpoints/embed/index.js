const { v4: uuidv4 } = require("uuid");
const { reqBody, multiUserMode } = require("../../utils/http");
const { Telemetry } = require("../../models/telemetry");
const { streamChatWithForEmbed } = require("../../utils/chats/embed");
const { EmbedChats } = require("../../models/embedChats");
const {
  validEmbedConfig,
  canRespond,
  setConnectionMeta,
} = require("../../utils/middleware/embedMiddleware");
const {
  convertToChatHistory,
  writeResponseChunk,
} = require("../../utils/helpers/chat/responses");
const prisma = require("../../utils/prisma");
const { FAQ } = require("../../models/faq");

function embeddedEndpoints(app) {
  if (!app) return;

  app.post(
    "/embed/:embedId/stream-chat",
    [validEmbedConfig, setConnectionMeta, canRespond],
    async (request, response) => {
      try {
        const embed = response.locals.embedConfig;
        const {
          sessionId,
          message,
          guided = false, //added guided
          // optional keys for override of defaults if enabled.
          prompt = null,
          model = null,
          temperature = null,
          username = null,
        } = reqBody(request);

        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("Content-Type", "text/event-stream");
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Connection", "keep-alive");
        response.flushHeaders();

        await streamChatWithForEmbed(response, embed, message, sessionId, {
          prompt,
          model,
          temperature,
          username,
          guided, //guided parameter
        });
        await Telemetry.sendTelemetry("embed_sent_chat", {
          multiUserMode: multiUserMode(response),
          LLMSelection: process.env.LLM_PROVIDER || "openai",
          Embedder: process.env.EMBEDDING_ENGINE || "inherit",
          VectorDbSelection: process.env.VECTOR_DB || "lancedb",
        });
        response.end();
      } catch (e) {
        console.error(e);
        writeResponseChunk(response, {
          id: uuidv4(),
          type: "abort",
          sources: [],
          textResponse: null,
          close: true,
          error: e.message,
        });
        response.end();
      }
    }
  );

  app.get(
    "/embed/:embedId/:sessionId",
    [validEmbedConfig],
    async (request, response) => {
      try {
        const { sessionId } = request.params;
        const embed = response.locals.embedConfig;
        const history = await EmbedChats.forEmbedByUser(
          embed.id,
          sessionId,
          null,
          null,
          true
        );

        response.status(200).json({ history: convertToChatHistory(history) });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.delete(
    "/embed/:embedId/:sessionId",
    [validEmbedConfig],
    async (request, response) => {
      try {
        const { sessionId } = request.params;
        const embed = response.locals.embedConfig;

        await EmbedChats.markHistoryInvalid(embed.id, sessionId);
        response.status(200).end();
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  // New endpoint to get embed configuration
  app.get(
    "/embed/:embedId/:sessionId/config",
    [validEmbedConfig],
    async (request, response) => {
      try {
        const embed = response.locals.embedConfig;

        // Return only necessary config data for the embed
        const configData = {
          id: embed.id,
          uuid: embed.uuid,
          enabled: embed.enabled,
          allow_model_override: embed.allow_model_override,
          allow_prompt_override: embed.allow_prompt_override,
          allow_temperature_override: embed.allow_temperature_override,
          max_chats_per_day: embed.max_chats_per_day,
          max_chats_per_session: embed.max_chats_per_session,
          chat_mode: embed.chat_mode
        };

        response.status(200).json(configData);
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  // New endpoint to get FAQs for an embed config
  app.get(
    "/embed/:embedId/:sessionId/:configId/faqs",
    [validEmbedConfig],
    async (request, response) => {
      try {
        const embed = response.locals.embedConfig;
        const { configId } = request.params;

        // Verify that the configId matches the embed ID
        if (Number(configId) !== embed.id) {
          return response.status(403).json({ error: "Unauthorized access to this config" });
        }

        // Get FAQs for this embed config
        const result = await FAQ.all(embed.id);

        if (!result.success) {
          return response.status(500).json({ error: result.error });
        }

        response.status(200).json({ faqs: result.faqs });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  // New endpoint to get articles for an embed config
  app.get(
    "/embed/:embedId/:sessionId/:configId/articles",
    [validEmbedConfig],
    async (request, response) => {
      try {
        const embed = response.locals.embedConfig;
        const { configId } = request.params;

        // Verify that the configId matches the embed ID
        if (Number(configId) !== embed.id) {
          return response.status(403).json({ error: "Unauthorized access to this config" });
        }

        // Get articles for this embed config
        const embedConfig = await prisma.embed_configs.findUnique({
          where: { id: embed.id },
          include: { embed_articles: true }
        });

        if (!embedConfig) {
          return response.status(404).json({ error: "Embed config not found" });
        }

        response.status(200).json(embedConfig.embed_articles);
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );
}

module.exports = { embeddedEndpoints };
