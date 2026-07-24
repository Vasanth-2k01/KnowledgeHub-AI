import { QdrantClient } from '@qdrant/js-client-rest';

// Validate environment variables
const qdrantUrl = process.env.QDRANT_URL;
const qdrantApiKey = process.env.QDRANT_API_KEY;

if (!qdrantUrl || !qdrantApiKey) {
  throw new Error('QDRANT_URL and QDRANT_API_KEY environment variables are required.');
}

// Create a singleton client
export const qdrantClient = new QdrantClient({
  url: qdrantUrl,
  apiKey: qdrantApiKey,
});

export const COLLECTION_NAME = 'knowledgehub';
// BAAI/bge-small-en-v1.5 has an embedding size of 384
export const VECTOR_SIZE = 384;

/**
 * Ensures the Qdrant collection exists.
 * If it doesn't exist, it creates it with the correct vector size and distance metric.
 */
export async function ensureCollection() {
  try {
    const collections = await qdrantClient.getCollections();
    console.log("collections.collections", collections.collections);
    const collectionExists = collections.collections.some(
      (c) => c.name === COLLECTION_NAME
    );

    if (!collectionExists) {
      console.log(`Creating Qdrant collection: ${COLLECTION_NAME}`);
      await qdrantClient.createCollection(COLLECTION_NAME, {
        vectors: {
          size: VECTOR_SIZE,
          distance: 'Cosine',
        },
      });
      console.log(`Collection ${COLLECTION_NAME} created successfully.`);
    } else {
      console.log(`Qdrant collection ${COLLECTION_NAME} already exists.`);
    }
  } catch (error) {
    console.error('Error ensuring Qdrant collection:', error);
    throw error;
  }
}
