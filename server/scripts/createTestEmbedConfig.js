const { EmbedConfig } = require("../models/embedConfig");
const { FAQ } = require("../models/faq");
const prisma = require("../utils/prisma");

async function createTestEmbedConfig() {
  console.log("Creating test embed config...");

  try {
    // Get the first workspace
    const workspace = await prisma.workspaces.findFirst();
    if (!workspace) {
      console.error("No workspace found. Please create a workspace first.");
      return;
    }

    console.log(`Using workspace ID: ${workspace.id}`);

    // Create a new embed config
    const embedConfig = await EmbedConfig.new({
      workspace_id: workspace.id,
      name: "Test Embed Config",
      chat_mode: "query",
      enabled: true
    });

    console.log(`Created embed config with ID: ${embedConfig.id} and UUID: ${embedConfig.uuid}`);

    // Create some test FAQs
    const testFaqs = [
      {
        question: "What is the test question 1?",
        answer: "This is a test answer 1."
      },
      {
        question: "What is the test question 2?",
        answer: "This is a test answer 2."
      },
      {
        question: "What is the test question 3?",
        answer: "This is a test answer 3."
      }
    ];

    for (const faq of testFaqs) {
      const result = await FAQ.create({
        question: faq.question,
        answer: faq.answer,
        embed_config_id: embedConfig.id
      });

      if (result.success) {
        console.log(`Created FAQ with ID: ${result.faq.id}`);
      } else {
        console.error(`Error creating FAQ: ${result.error}`);
      }
    }

    console.log("Test embed config and FAQs created successfully");
    console.log(`Embed Config UUID: ${embedConfig.uuid}`);
  } catch (error) {
    console.error("Error creating test embed config:", error);
  } finally {
    // Close the Prisma connection
    await prisma.$disconnect();
  }
}

// Run the function
createTestEmbedConfig();
