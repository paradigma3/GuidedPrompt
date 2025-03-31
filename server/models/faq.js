// server/models/faq.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class FAQ {
  static async create({ question, answer, embed_config_id }) {
    if (!question || !answer || !embed_config_id) {
      return { faq: null, error: "Question, answer, and embed config ID are required." };
    }
    question = question.trim();
    answer = answer.trim();

    try {
      // Check if this is the first FAQ for this embed
      const existingFaqs = await prisma.fAQ.findMany({
        where: { embed_config_id: Number(embed_config_id) },
      });

      // If this is not the first FAQ and it's the default welcome FAQ, skip creation
      if (existingFaqs.length > 0 &&
          question === "Welcome FAQ" &&
          answer === "This is your first FAQ. You can edit or delete it and add more FAQs as needed.") {
        return { faq: existingFaqs[0], error: null };
      }

      const faq = await prisma.fAQ.create({
        data: { question, answer, embed_config_id: Number(embed_config_id) },
      });
      return { faq, error: null };
    } catch (error) {
      console.error("FAQ creation error:", error);
      return { faq: null, error: "Failed to create FAQ." };
    }
  }

  static async all(embed_config_id) { // Method to get FAQs for a specific embed
    if (!embed_config_id) {
      return { faqs: [], error: "Embed config ID is required to fetch FAQs." };
    }
    try {
      const faqs = await prisma.fAQ.findMany({
        where: { embed_config_id: Number(embed_config_id) },
        orderBy: { createdAt: "desc" },
      });
      return { faqs, error: null };
    } catch (error) {
      console.error("Failed to get FAQs for embed:", error);
      return { faqs: [], error: "Failed to get FAQs." };
    }
  }

  // New method to get all FAQ collections (linked to embed configs) - just returns embed configs with FAQ count
  static async allCollections() {
    try {
      const collections = await prisma.embed_configs.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          workspace: true,
          _count: {
            select: { faqs: true },
          },
        },
      });
      return { collections, error: null };
    } catch (error) {
      console.error("Failed to get FAQ collections:", error);
      return { collections: [], error: "Failed to get FAQ collections." };
    }
  }


  static async update(id, updates) {
    try {
      const faq = await prisma.fAQ.update({
        where: { id: Number(id) },
        data: updates,
      });
      return { faq, error: null };
    } catch (error) {
      console.error("Error updating FAQ:", error);
      return { faq: null, error: "Failed to update FAQ." };
    }
  }

  static async delete(id) {
    try {
      await prisma.fAQ.delete({
        where: { id: Number(id) },
      });
      return { success: true, error: null };
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      return { success: false, error: "Failed to delete FAQ." };
    }
  }

  static async get(id) {
    try {
      return await prisma.fAQ.findUnique({
        where: { id: Number(id) },
      });
    } catch (error) {
      console.error("Error getting FAQ:", error);
      return null;
    }
  }
}

module.exports = { FAQ };
