const { v4 } = require("uuid");
const prisma = require("../utils/prisma");
const { VALID_CHAT_MODE } = require("../utils/chats/stream");

const EmbedConfig = {
  writable: [
    // Used for generic updates so we can validate keys in request body
    "enabled",
    "allowlist_domains",
    "allow_model_override",
    "allow_temperature_override",
    "allow_prompt_override",
    "max_chats_per_day",
    "max_chats_per_session",
    "chat_mode",
    "workspace_id",
  ],

  new: async function (data = {}, userId = null) {
    try {
      const validData = {};
      for (const [key, value] of Object.entries(data)) {
        if (!this.writable.includes(key)) continue;
        validData[key] = validatedCreationData(value, key);
      }

      const embed = await prisma.embed_configs.create({
        data: {
          ...validData,
          uuid: v4(),
          enabled: true,
          chat_mode: validData.chat_mode || "query",
          workspace_id: Number(data.workspace_id),
          createdBy: userId ? Number(userId) : null,
        },
      });

      // Create an empty FAQ collection for this embed
      await prisma.fAQ.create({
        data: {
          embed_config_id: embed.id,
          question: "Welcome FAQ",
          answer: "This is your first FAQ. You can edit or delete it and add more FAQs as needed."
        }
      });

      return { embed, message: null };
    } catch (error) {
      console.error(error.message);
      return { embed: null, message: error.message };
    }
  },

  update: async function (embedId = null, data = {}) {
    if (!embedId) throw new Error("No embed id provided for update");
    const validKeys = Object.keys(data).filter((key) =>
      this.writable.includes(key)
    );
    if (validKeys.length === 0)
      return { embed: { id }, message: "No valid fields to update!" };

    const updates = {};
    validKeys.map((key) => {
      updates[key] = validatedCreationData(data[key], key);
    });

    try {
      await prisma.embed_configs.update({
        where: { id: Number(embedId) },
        data: updates,
      });
      return { success: true, error: null };
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  },

  get: async function (clause = {}) {
    try {
      const embedConfig = await prisma.embed_configs.findFirst({
        where: clause,
      });

      return embedConfig || null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  getWithWorkspace: async function (clause = {}) {
    try {
      const embedConfig = await prisma.embed_configs.findFirst({
        where: clause,
        include: {
          workspace: true,
        },
      });

      return embedConfig || null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  delete: async function (clause = {}) {
    try {
      await prisma.embed_configs.delete({
        where: clause,
      });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

  where: async function (clause = {}, limit = null, orderBy = null) {
    try {
      const results = await prisma.embed_configs.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
      });
      return results;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  whereWithWorkspace: async function (
    clause = {},
    limit = null,
    orderBy = null
  ) {
    try {
      const results = await prisma.embed_configs.findMany({
        where: clause,
        include: {
          workspace: true,
          _count: {
            select: { embed_chats: true },
          },
        },
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
      });
      return results;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  // Will return null if process should be skipped
  // an empty array means the system will check. This
  // prevents a bad parse from allowing all requests
  parseAllowedHosts: function (embed) {
    if (!embed.allowlist_domains) return null;

    try {
      return JSON.parse(embed.allowlist_domains);
    } catch {
      console.error(`Failed to parse allowlist_domains for Embed ${embed.id}!`);
      return [];
    }
  },
};

const BOOLEAN_KEYS = [
  "allow_model_override",
  "allow_temperature_override",
  "allow_prompt_override",
  "enabled",
];

const NUMBER_KEYS = [
  "max_chats_per_day",
  "max_chats_per_session",
  "workspace_id",
];

// Helper to validate a data object strictly into the proper format
function validatedCreationData(value, field) {
  if (field === "chat_mode") {
    if (!value || !VALID_CHAT_MODE.includes(value)) return "query";
    return value;
  }

  if (field === "allowlist_domains") {
    try {
      if (!value) return null;
      return JSON.stringify(
        // Iterate and force all domains to URL object
        // and stringify the result.
        value
          .split(",")
          .map((input) => {
            let url = input;
            if (!url.includes("http://") && !url.includes("https://"))
              url = `https://${url}`;
            try {
              new URL(url);
              return url;
            } catch {
              return null;
            }
          })
          .filter((u) => !!u)
      );
    } catch {
      return null;
    }
  }

  if (BOOLEAN_KEYS.includes(field)) {
    return value === true || value === false ? value : false;
  }

  if (NUMBER_KEYS.includes(field)) {
    return isNaN(value) || Number(value) <= 0 ? null : Number(value);
  }

  return null;
}

module.exports = { EmbedConfig };
