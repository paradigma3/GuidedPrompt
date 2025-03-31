// server/endpoints/faq.js
const { FAQ } = require("../models/faq");
const { EmbedConfig } = require("../models/embedConfig");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const { flexUserRoleValid, ROLES } = require("../utils/middleware/multiUserProtected");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { validApiKey } = require("../utils/middleware/validApiKey");

function apiFaqEndpoints(router) {
  if (!router) return;

  router.get("/embed-config/:uuid", [validatedRequest, flexUserRoleValid([ROLES.admin])], async (req, res) => {
    try {
      const { uuid } = req.params;
      const embed = await prisma.embed_configs.findFirst({
        where: { uuid },
      });
      if (!embed) {
        return res.status(404).json({ error: "Embed config not found" });
      }
      res.json(embed);
    } catch (error) {
      console.error("Error fetching embed config:", error);
      res.status(500).json({ error: "Failed to fetch embed config" });
    }
  });

  router.get("/embed-faqs/collections", [validatedRequest, flexUserRoleValid([ROLES.admin])], async (req, res) => {
    try {
      const { collections, error } = await FAQ.allCollections();
      if (error) {
        return res.status(500).json({ error });
      }
      res.status(200).json({ collections });
    } catch (error) {
      console.error("Error fetching FAQ collections:", error);
      res.status(500).json({ error: "Failed to fetch FAQ collections" });
    }
  });

  router.get("/embed-faqs/:embedId/faqs", [validatedRequest, flexUserRoleValid([ROLES.admin])], async (req, res) => {
    try {
      const { embedId } = req.params;
      const faqs = await prisma.fAQ.findMany({
        where: { embed_config_id: parseInt(embedId) },
        include: {
          suggestions: true,
          widgets: true,
        },
      });
      res.json({ faqs });
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      res.status(500).json({ error: "Failed to fetch FAQs" });
    }
  });

  router.post("/embed-faqs/:embedId/faq", [validatedRequest, flexUserRoleValid([ROLES.admin])], async (req, res) => {
    try {
      const { embedId } = req.params;
      const { question, answer } = req.body;
      const faq = await prisma.fAQ.create({
        data: {
          question,
          answer,
          embed_config_id: parseInt(embedId),
        },
      });
      res.json({ faq });
    } catch (error) {
      console.error("Error creating FAQ:", error);
      res.status(500).json({ error: "Failed to create FAQ" });
    }
  });

  router.put("/embed-faqs/:embedId/faq/:faqId", [validatedRequest, flexUserRoleValid([ROLES.admin])], async (req, res) => {
    try {
      const { question, answer } = req.body;
      const faq = await prisma.fAQ.update({
        where: { id: Number(req.params.faqId) },
        data: {
          question,
          answer,
        },
        include: {
          suggestions: true,
          widgets: true,
        },
      });
      return res.status(200).json({ faq });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to update FAQ" });
    }
  });

  router.delete("/embed-faqs/:embedId/faq/:faqId", [validatedRequest, flexUserRoleValid([ROLES.admin])], async (req, res) => {
    try {
      await prisma.fAQ.delete({
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
      const faq = await prisma.fAQ.findUnique({
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

      // Validate widgets data
      if (widgets && widgets.length > 0) {
        for (const widget of widgets) {
          if (!widget.type || !widget.label) {
            return res.status(400).json({ error: "Each widget must have a type and label" });
          }

          if (widget.type === 'iframe') {
            if (!widget.url || typeof widget.url !== 'string' || !widget.url.match(/^https?:\/\//)) {
              return res.status(400).json({ error: "Invalid iframe URL format" });
            }
          } else if (widget.type === 'gallery') {
            if (!Array.isArray(widget.images) || widget.images.length === 0) {
              return res.status(400).json({ error: "Gallery must have at least one image" });
            }
            if (widget.images.length > 6) {
              return res.status(400).json({ error: "Gallery cannot have more than 6 images" });
            }
            for (const imageUrl of widget.images) {
              if (typeof imageUrl !== 'string' || !imageUrl.match(/^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)$/i)) {
                return res.status(400).json({ error: "Invalid image URL format" });
              }
            }
          } else {
            return res.status(400).json({ error: "Invalid widget type" });
          }
        }
      }

      // Delete existing widgets - SQLite doesn't support deleteMany
      const existingWidgets = await prisma.widget.findMany({
        where: { faq_id: Number(faqId) }
      });
      await Promise.all(existingWidgets.map(widget =>
        prisma.widget.delete({
          where: { id: widget.id }
        })
      ));

      // Create new widgets
      if (widgets && widgets.length > 0) {
        await Promise.all(widgets.map(widget => {
          const widgetData = {
            type: widget.type,
            label: widget.label,
            url: widget.type === 'iframe' ? widget.url : null,
            images: widget.type === 'gallery' ? JSON.stringify(widget.images) : null,
            faq_id: Number(faqId)
          };
          return prisma.widget.create({ data: widgetData });
        }));
      }

      // Return the updated FAQ with its widgets
      const updatedFaq = await prisma.fAQ.findUnique({
        where: { id: Number(faqId) },
        include: {
          suggestions: true,
          widgets: true,
        },
      });

      // Parse the images field for gallery widgets
      if (updatedFaq.widgets) {
        updatedFaq.widgets = updatedFaq.widgets.map(widget => ({
          ...widget,
          images: widget.type === 'gallery' && widget.images ? JSON.parse(widget.images) : null
        }));
      }

      res.json({ faq: updatedFaq });
    } catch (error) {
      console.error("Error updating widgets:", error);
      res.status(500).json({ error: "Failed to update widgets" });
    }
  });

  return router;
}

module.exports = { apiFaqEndpoints };
