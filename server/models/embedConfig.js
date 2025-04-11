const { v4 } = require("uuid");
const prisma = require("../utils/prisma");
const { VALID_CHAT_MODE } = require("../utils/chats/stream");
const { FAQ } = require("./faq");

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
    console.log(`[EmbedConfig] Creating new embed config with data:`, data);
    try {
      const validData = {};
      for (const [key, value] of Object.entries(data)) {
        if (!this.writable.includes(key)) continue;
        validData[key] = validatedCreationData(value, key);
      }

      console.log(`[EmbedConfig] Creating embed config with valid data:`, validData);
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
      console.log(`[EmbedConfig] Successfully created embed config with ID: ${embed.id}`);

      // Create an empty FAQ collection for this embed using the FAQ model
      try {
        console.log(`[EmbedConfig] Attempting to create default FAQ for embed ID: ${embed.id}`);
        const defaultFaq = await FAQ.create({
          embed_config_id: embed.id,
          question: "Welcome FAQ",
          answer: "This is your first FAQ. You can edit or delete it and add more FAQs as needed."
        });
        console.log(`[EmbedConfig] Successfully created default FAQ with ID: ${defaultFaq.id}`);
      } catch (faqError) {
        console.error(`[EmbedConfig] Error creating default FAQ:`, faqError);
        // We'll keep the embed even if FAQ creation fails
        // The user can add FAQs manually later
      }

      return embed;
    } catch (error) {
      console.error(`[EmbedConfig] Error creating embed config:`, error);
      throw error;
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
      // First delete all related FAQs
      await prisma.fAQ.deleteMany({
        where: {
          embed_config_id: clause.id
        }
      });

      // Then delete the embed config
      await prisma.embed_configs.delete({
        where: clause,
      });
      return true;
    } catch (error) {
      console.error(`[EmbedConfig] Error deleting embed config:`, error);
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
