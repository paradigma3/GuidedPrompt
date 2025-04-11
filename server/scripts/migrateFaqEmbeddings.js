// Load environment variables
require('dotenv').config({ path: './server/.env.development' });

const prisma = require("../utils/prisma");
const { getVectorDbClass, getFaqNamespace, createFaqVectorMetadata } = require("../utils/helpers");

async function migrateFaqEmbeddings() {
  console.log("Starting FAQ embeddings migration...");

  try {
    // Get all FAQs with embeddings
    const faqs = await prisma.FAQ.findMany({
      where: {
        embedding: {
          not: null
        }
      }
    });

    console.log(`Found ${faqs.length} FAQs with embeddings to migrate`);

    // Process each FAQ
    for (const faq of faqs) {
      try {
        // Parse the embedding
        const embedding = JSON.parse(faq.embedding);

        // Get the vector database
        const VectorDb = getVectorDbClass();
        const namespace = getFaqNamespace(faq.embed_config_id);

        // Create metadata
        const metadata = createFaqVectorMetadata(faq);

        // Add to vector database
        await VectorDb.addFaqToNamespace(namespace, metadata, embedding);

        console.log(`Migrated FAQ ID: ${faq.id}`);
      } catch (error) {
        console.error(`Error migrating FAQ ID: ${faq.id}`, error);
      }
    }

    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    // Close the Prisma connection
    await prisma.$disconnect();
  }
}

// Run the migration
migrateFaqEmbeddings();
