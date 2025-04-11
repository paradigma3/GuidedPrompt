# FAQ Vector Database Migration

## Overview

This document describes the migration of FAQ embeddings from SQLite to a vector database. The migration improves performance, reduces database size, and better utilizes the existing vector database infrastructure.

## Changes Made

1. **FAQ Model Updates**
   - Removed embedding storage in SQLite
   - Added vector database operations for CRUD operations
   - Modified methods to handle both SQLite and vector database operations

2. **Chat Streaming Function Updates**
   - Replaced manual similarity search with vector database search
   - Updated FAQ retrieval to use vector database results
   - Improved error handling and logging

3. **Database Schema Updates**
   - Removed the embedding column from the FAQ table
   - Created a migration to apply the schema change

## Migration Process

To migrate existing FAQ embeddings from SQLite to the vector database, follow these steps:

1. Run the migration script:
   ```
   node server/scripts/migrateFaqEmbeddings.js
   ```

2. Verify the migration by checking the vector database:
   ```
   node server/scripts/testFaqVectorDb.js
   ```

3. Apply the schema change:
   ```
   npx prisma migrate dev --name remove_faq_embedding
   ```

## Testing

To test the new implementation:

1. Create a new FAQ and verify it's stored in both SQLite and the vector database
2. Update a FAQ and verify the changes are reflected in both databases
3. Delete a FAQ and verify it's removed from both databases
4. Test the chat streaming function to ensure it correctly retrieves relevant FAQs

## Benefits

- **Reduced Database Size**: Embeddings are no longer stored in SQLite, reducing the database size
- **Improved Performance**: Vector database is optimized for similarity search
- **Better Scalability**: Vector database can handle larger numbers of FAQs
- **Consistency**: FAQ embeddings are now handled the same way as document embeddings

## Troubleshooting

If you encounter issues during the migration:

1. Check the logs for error messages
2. Verify that the vector database is properly configured
3. Ensure all required dependencies are installed
4. Check that the FAQ model and vector database provider are correctly implemented
