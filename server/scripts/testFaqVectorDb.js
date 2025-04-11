// Load environment variables
require('dotenv').config({ path: './server/.env.development' });

const prisma = require("../utils/prisma");
const { getVectorDbClass, getFaqNamespace, createFaqVectorMetadata, getEmbeddingEngineSelection } = require("../utils/helpers");

async function testFaqVectorDb() {
  console.log("Starting FAQ vector database test...");

  try {
    // Get a test embed config ID
    const embedConfig = await prisma.embed_configs.findFirst();
    if (!embedConfig) {
      console.error("No embed config found. Please create one first.");
      return;
    }

    const embedConfigId = embedConfig.id;
    console.log(`Using embed config ID: ${embedConfigId}`);

    // Create a test FAQ
    console.log("Creating test FAQ...");
    const embedder = getEmbeddingEngineSelection();
    const question = "What is the test question?";
    const answer = "This is a test answer.";
    const embedding = await embedder.embedTextInput(question);

    // Create FAQ in SQLite
    const faq = await prisma.FAQ.create({
      data: {
        question,
        answer,
        embed_config_id: embedConfigId,
      }
    });

    console.log(`Created FAQ with ID: ${faq.id}`);

    // Add to vector database
    const VectorDb = getVectorDbClass();
    const namespace = getFaqNamespace(embedConfigId);
    const metadata = createFaqVectorMetadata(faq);
    await VectorDb.addFaqToNamespace(namespace, metadata, embedding);

    console.log("Added FAQ to vector database");

    // Test search
    console.log("Testing search...");
    const searchResults = await VectorDb.searchFaqs({
      namespace,
      queryVector: embedding,
      similarityThreshold: 0.7,
      topN: 1
    });

    console.log("Search results:", JSON.stringify(searchResults, null, 2));

    // Test update
    console.log("Testing update...");
    const updatedQuestion = "What is the updated test question?";
    const updatedEmbedding = await embedder.embedTextInput(updatedQuestion);

    // Update in SQLite
    const updatedFaq = await prisma.FAQ.update({
      where: { id: faq.id },
      data: { question: updatedQuestion }
    });

    // Update in vector database
    const updatedMetadata = createFaqVectorMetadata(updatedFaq);
    await VectorDb.updateFaqInNamespace(namespace, updatedMetadata, updatedEmbedding);

    console.log("Updated FAQ in vector database");

    // Test search again
    console.log("Testing search after update...");
    const updatedSearchResults = await VectorDb.searchFaqs({
      namespace,
      queryVector: updatedEmbedding,
      similarityThreshold: 0.7,
      topN: 1
    });

    console.log("Updated search results:", JSON.stringify(updatedSearchResults, null, 2));

    // Test delete
    console.log("Testing delete...");
    await VectorDb.deleteFaqFromNamespace(namespace, faq.id);
    await prisma.FAQ.delete({ where: { id: faq.id } });

    console.log("Deleted FAQ from both databases");

    console.log("Test completed successfully");
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    // Close the Prisma connection
    await prisma.$disconnect();
  }
}

// Run the function
testFaqVectorDb();
