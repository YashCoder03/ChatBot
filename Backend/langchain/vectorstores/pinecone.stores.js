import pc from "../../config/pinecone.config.js"

const storeInPinecone = async(docsWithVectors) => {
    const pineconeIndex = pc.Index(process.env.PINECONE_INDEX_NAME);
    const vectors = docsWithVectors.map((doc, i) => ({
        id: `chunk-${Date.now()}-${i}`,
        values: doc.embedding, // should be an array of numbers
        metadata: {
            content: doc.content || '', // ensure it's a plain string
            source: doc.metadata?.source || '', // optional but useful
        },
    }));
    console.log(JSON.stringify(vectors[0]));
    await pineconeIndex.upsert(vectors);
}

export default storeInPinecone;
