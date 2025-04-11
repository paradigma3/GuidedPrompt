// server/endpoints/faq.js
const { FAQ } = require("../models/faq");
const { EmbedConfig } = require("../models/embedConfig");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const { flexUserRoleValid, ROLES } = require("../utils/middleware/multiUserProtected");
const prisma = require("../utils/prisma");
const { validApiKey } = require("../utils/middleware/validApiKey");

function apiFaqEndpoints(router) {
  if (!router) return;

  router.get("/embed-config/:uuid", [validatedRequest, flexUserRoleValid([ROLES.admin])], async (req, res) => {
    console.log(`[API] GET /embed-config/:uuid - Request for UUID: ${req.params.uuid}`);
    try {
      const { uuid } = req.params;
      const embed = await prisma.embed_configs.findFirst({
        where: { uuid },
      });
      if (!embed) {
        console.log(`[API] GET /embed-config/:uuid - Embed config not found for UUID: ${uuid}`);
        return res.status(404).json({ error: "Embed config not found" });
      }
      console.log(`[API] GET /embed-config/:uuid - Found embed config with ID: ${embed.id}`);
      res.json(embed);
    } catch (error) {
      console.error(`[API] GET /embed-config/:uuid - Error:`, error);
      res.status(500).json({ error: "Failed to fetch embed config" });
    }
  });

  router.get("/embed-faqs/collections", [validatedRequest, flexUserRoleValid([ROLES.admin])], async (req, res) => {
    console.log(`[API] GET /embed-faqs/collections - Request for FAQ collections`);
    try {
      const collections = await FAQ.allCollections();
      console.log(`[API] GET /embed-faqs/collections - Returning ${collections.length} collections`);
      res.json({ collections });
    } catch (error) {
      console.error(`[API] GET /embed-faqs/collections - Error:`, error);
      res.status(500).json({ error: "Failed to fetch FAQ collections" });
    }
  });

  router.get("/embed-faqs/:embedId/faqs", [validatedRequest, flexUserRoleValid([ROLES.admin])], async (req, res) => {
    console.log(`[API] GET /embed-faqs/:embedId/faqs - Request for embedId: ${req.params.embedId}`);
    try {
      const { embedId } = req.params;
      const result = await FAQ.all(parseInt(embedId));

      if (!result.success) {
        return res.status(500).json({ error: result.error });
      }

      console.log(`[API] GET /embed-faqs/:embedId/faqs - Found ${result.faqs.length} FAQs for embedId: ${embedId}`);
      res.json({ faqs: result.faqs });
    } catch (error) {
      console.error(`[API] GET /embed-faqs/:embedId/faqs - Error:`, error);
      res.status(500).json({ error: "Failed to fetch FAQs" });
    }
  });

  router.post("/embed-faqs/:embedId/faq", [validatedRequest, flexUserRoleValid([ROLES.admin])], async (req, res) => {
    try {
      const { embedId } = req.params;
      const { question, answer } = req.body;

      const result = await FAQ.create({
        question,
        answer,
        embed_config_id: parseInt(embedId),
      });

      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }

      res.json({ faq: result.faq });
    } catch (error) {
      console.error("Error creating FAQ:", error);
      res.status(500).json({ error: error.message || "Failed to create FAQ" });
    }
  });

  router.put("/embed-faqs/:embedId/faq/:faqId", [validatedRequest, flexUserRoleValid([ROLES.admin])], async (req, res) => {
    try {
      const { question, answer } = req.body;
      const result = await FAQ.update(Number(req.params.faqId), { question, answer });

      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }

      return res.status(200).json({ faq: result.faq });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message || "Failed to update FAQ" });
    }
  });

  router.delete("/embed-faqs/:embedId/faq/:faqId", [validatedRequest, flexUserRoleValid([ROLES.admin])], async (req, res) => {
    try {
      await prisma.FAQ.delete({
        where: { id: Number(req.params.faqId) },
      });
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      return res.status(500).json({ error: "Failed to delete FAQ" });
    }
  });

  router.put("/embed-faqs/:embedId/faq/:faqId/suggestions", [validatedRequest, flexUserRoleValid([ROLES.admin])], async (req, res) => {
    try {
      const { faqId } = req.params;
      const { suggestions } = req.body;

      // Delete existing suggestions - SQLite doesn't support deleteMany
      const existingSuggestions = await prisma.suggestion.findMany({
        where: { faq_id: Number(faqId) }
      });
      await Promise.all(existingSuggestions.map(suggestion =>
        prisma.suggestion.delete({
          where: { id: suggestion.id }
        })
      ));

      // Create new suggestions one by one since SQLite doesn't support createMany
      if (suggestions && suggestions.length > 0) {
        await Promise.all(suggestions.map(suggestion =>
          prisma.suggestion.create({
            data: {
              type: suggestion.type,
              text: suggestion.text,
              url: suggestion.url,
              faq_id: Number(faqId)
            }
          })
        ));
      }

      // Return updated FAQ with suggestions
      const faq = await prisma.FAQ.findUnique({
        where: { id: Number(faqId) },
        include: {
          suggestions: true,
          widgets: true
        }
      });

      res.json({ faq });
    } catch (error) {
      console.error("Error updating suggestions:", error);
      res.status(500).json({ error: "Failed to update suggestions" });
    }
  });

  router.put("/embed-faqs/:embedId/faq/:faqId/widgets", [validatedRequest, flexUserRoleValid([ROLES.admin])], async (req, res) => {
    try {
      const { faqId } = req.params;
      const { widgets } = req.body;

      // Delete existing widgets - SQLite doesn't support deleteMany
      const existingWidgets = await prisma.widget.findMany({
        where: { faq_id: Number(faqId) }
      });
      await Promise.all(existingWidgets.map(widget =>
        prisma.widget.delete({
          where: { id: widget.id }
        })
      ));

      // Create new widgets one by one since SQLite doesn't support createMany
      if (widgets && widgets.length > 0) {
        await Promise.all(widgets.map(widget =>
          prisma.widget.create({
            data: {
              type: widget.type,
              label: widget.label,
              url: widget.url,
              images: widget.images ? JSON.stringify(widget.images) : null,
              faq_id: Number(faqId)
            }
          })
        ));
      }

      // Return updated FAQ with widgets
      const faq = await prisma.FAQ.findUnique({
        where: { id: Number(faqId) },
        include: {
          suggestions: true,
          widgets: true
        }
      });

      res.json({ faq });
    } catch (error) {
      console.error("Error updating widgets:", error);
      res.status(500).json({ error: "Failed to update widgets" });
    }
  });

  // Get embed articles for a specific embed config
  router.get('/embed-faqs/:embedId/articles', async (req, res) => {
    try {
      const { embedId } = req.params;
      const embedConfig = await prisma.embed_configs.findUnique({
        where: { id: Number(embedId) },
        include: { embed_articles: true }
      });

      if (!embedConfig) {
        return res.status(404).json({ error: 'Embed config not found' });
      }

      return res.json(embedConfig.embed_articles);
    } catch (error) {
      console.error('Error fetching embed articles:', error);
      return res.status(500).json({ error: 'Failed to fetch embed articles' });
    }
  });

  // Create a new embed article
  router.post('/embed-faqs/:embedId/articles', async (req, res) => {
    try {
      const { embedId } = req.params;
      const { title, description, image_url, url } = req.body;
      console.log('Request Body:', req.body);
      // Validate required fields
      if (!title || !description || !image_url || !url) {
        return res.status(400).json({ error: `Missing required fields: ${!title ? 'title' : ''}${!description ? 'description' : ''}${!image_url ? 'image_url' : ''}${!url ? 'url' : ''}` });
      }

      // Check if embed config exists
      const embedConfig = await prisma.embed_configs.findUnique({
        where: { id: Number(embedId) },
        include: { embed_articles: true }
      });

      if (!embedConfig) {
        return res.status(404).json({ error: 'Embed config not found' });
      }

      // Check if max articles limit is reached
      if (embedConfig.embed_articles.length >= 3) {
        return res.status(400).json({ error: 'Maximum number of articles (3) reached' });
      }

      // Create new embed article
      const newArticle = await prisma.embedArticle.create({
        data: {
          title,
          description,
          image_url,
          url,
          embed_config_id: Number(embedId)
        }
      });

      return res.json(newArticle);
    } catch (error) {
      console.error('Error creating embed article:', error);
      return res.status(500).json({ error: 'Failed to create embed article' });
    }
  });

  // Update an embed article
  router.put('/embed-faqs/:embedId/articles/:articleId', async (req, res) => {
    try {
      const { embedId, articleId } = req.params;
      const { title, description, image_url, url } = req.body;

      // Validate required fields
      if (!title || !description || !image_url || !url) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Check if article exists
      const article = await prisma.embedArticle.findUnique({
        where: { id: Number(articleId) }
      });

      if (!article) {
        return res.status(404).json({ error: 'Article not found' });
      }

      // Update article
      const updatedArticle = await prisma.embedArticle.update({
        where: { id: Number(articleId) },
        data: {
          title,
          description,
          image_url,
          url
        }
      });

      return res.json(updatedArticle);
    } catch (error) {
      console.error('Error updating embed article:', error);
      return res.status(500).json({ error: 'Failed to update embed article' });
    }
  });

  // Delete an embed article
  router.delete('/embed-faqs/:embedId/articles/:articleId', async (req, res) => {
    try {
      const { articleId } = req.params;

      // Check if article exists
      const article = await prisma.embedArticle.findUnique({
        where: { id: Number(articleId) }
      });

      if (!article) {
        return res.status(404).json({ error: 'Article not found' });
      }

      // Delete article
      await prisma.embedArticle.delete({
        where: { id: Number(articleId) }
      });

      return res.json({ success: true });
    } catch (error) {
      console.error('Error deleting embed article:', error);
      return res.status(500).json({ error: 'Failed to delete embed article' });
    }
  });

  return router;
}

module.exports = { apiFaqEndpoints };
