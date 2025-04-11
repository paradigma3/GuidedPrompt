// server/models/faq.js
const prisma = require("../utils/prisma");
const { getEmbeddingEngineSelection, getVectorDbClass, getFaqNamespace, createFaqVectorMetadata } = require("../utils/helpers");

class FAQ {
  static async create({ question, answer, embed_config_id }) {
    try {
      console.log("[FAQ.create] Creating new FAQ");

      // Check if FAQ with same question exists
      const existing = await prisma.FAQ.findFirst({
        where: { question, embed_config_id },
      });

      if (existing) {
        return { success: false, error: "FAQ with this question already exists" };
      }

      // Generate embedding for the question
      console.log("[FAQ.create] Getting embedding engine for new FAQ");
      const embedder = getEmbeddingEngineSelection();
      const embedding = await embedder.embedTextInput(question);

      // Create the FAQ in SQLite
      const faq = await prisma.FAQ.create({
        data: {
          question,
          answer,
          embed_config_id,
        },
        include: {
          suggestions: true,
          widgets: true,
        },
      });

      // Add FAQ to vector database
      const VectorDb = getVectorDbClass();
      const namespace = getFaqNamespace(embed_config_id);
      const metadata = createFaqVectorMetadata(faq);
      await VectorDb.addFaqToNamespace(namespace, metadata, embedding);

      return { success: true, faq };
    } catch (error) {
      console.error("[FAQ.create] Error creating FAQ:", error);
      return { success: false, error: error.message };
    }
  }

  static async getEmbeddings(embedId) {
    console.log(`[FAQ.getEmbeddings] Getting embeddings for embedId: ${embedId}`);
    const faqs = await prisma.FAQ.findMany({
      where: { embed_config_id: embedId },
      select: {
        id: true,
        question: true,
        answer: true
      }
    });

    console.log(`[FAQ.getEmbeddings] Found ${faqs.length} FAQs for embedId: ${embedId}`);
    return faqs;
  }

  static async update(id, { question, answer }) {
    try {
      console.log("[FAQ.update] Updating FAQ with ID:", id);

      // Get the FAQ to get its embed_config_id
      const existingFaq = await prisma.FAQ.findUnique({
        where: { id },
        select: { embed_config_id: true }
      });

      if (!existingFaq) {
        return { success: false, error: "FAQ not found" };
      }

      let embedding;
      if (question) {
        console.log("[FAQ.update] Getting embedding engine for FAQ update ID:", id);
        const embedder = getEmbeddingEngineSelection();
        console.log("[FAQ.update] Generating new embedding for FAQ ID:", id);
        embedding = await embedder.embedTextInput(question);
      }

      // Update the FAQ in SQLite
      const faq = await prisma.FAQ.update({
        where: { id },
        data: {
          ...(question && { question }),
          ...(answer && { answer }),
        },
        include: {
          suggestions: true,
          widgets: true,
        },
      });

      // Update FAQ in vector database if question was updated
      if (question && embedding) {
        const VectorDb = getVectorDbClass();
        const namespace = getFaqNamespace(existingFaq.embed_config_id);
        const metadata = createFaqVectorMetadata(faq);
        await VectorDb.updateFaqInNamespace(namespace, metadata, embedding);
      }

      return { success: true, faq };
    } catch (error) {
      console.error("[FAQ.update] Error updating FAQ:", error);
      return { success: false, error: error.message };
    }
  }

  static async all(embed_config_id) {
    console.log(`[FAQ.all] Getting all FAQs for embed_config_id: ${embed_config_id}`);

    if (!embed_config_id) {
      console.error(`[FAQ.all] Missing embed_config_id`);
      return { faqs: [], error: "Embed config ID is required to fetch FAQs." };
    }

    try {
      const faqs = await prisma.FAQ.findMany({
        where: { embed_config_id },
        orderBy: { createdAt: "desc" },
        include: {
          suggestions: true,
          widgets: true,
        },
      });

      return { success: true, faqs };
    } catch (error) {
      console.error("[FAQ.all] Error fetching FAQs:", error);
      return { success: false, error: error.message };
    }
  }

  static async allCollections() {
    try {
      const collections = await prisma.embed_configs.findMany({
        where: {
          enabled: true,
        },
        include: {
          _count: {
            select: {
              faqs: true
            }
          }
        }
      });
      return collections;
    } catch (error) {
      console.error("[FAQ.allCollections] Error fetching collections:", error);
      return [];
    }
  }

  static async delete(id) {
    console.log(`[FAQ.delete] Deleting FAQ with ID: ${id}`);

    try {
      // Get the FAQ to get its embed_config_id
      const existingFaq = await prisma.FAQ.findUnique({
        where: { id: Number(id) },
        select: { embed_config_id: true }
      });

      if (!existingFaq) {
        return { success: false, error: "FAQ not found" };
      }

      // Delete from SQLite
      await prisma.FAQ.delete({
        where: { id: Number(id) },
      });

      // Delete from vector database
      const VectorDb = getVectorDbClass();
      const namespace = getFaqNamespace(existingFaq.embed_config_id);
      await VectorDb.deleteFaqFromNamespace(namespace, id);

      console.log(`[FAQ.delete] FAQ deleted successfully ID: ${id}`);
      return { success: true, error: null };
    } catch (error) {
      console.error(`[FAQ.delete] Error deleting FAQ ID: ${id}`, error);
      return { success: false, error: "Failed to delete FAQ." };
    }
  }

  static async get(id) {
    console.log(`[FAQ.get] Getting FAQ with ID: ${id}`);

    try {
      const faq = await prisma.FAQ.findUnique({
        where: { id: Number(id) },
        include: {
          suggestions: true,
          widgets: true,
        },
      });

      console.log(`[FAQ.get] FAQ found: ${!!faq}`);
      return { faq, error: null };
    } catch (error) {
      console.error(`[FAQ.get] Error getting FAQ ID: ${id}`, error);
      return { faq: null, error: "Failed to get FAQ." };
    }
  }

  static async embedText(text) {
    const embedder = getEmbeddingEngineSelection();
    return await embedder.embedText(text);
  }
}

module.exports = { FAQ };
