import pc from "../../config/pinecone.config.js"

const storeInPinecone = async(docsWithVectors) => {
    const pineconeIndex = pc.Index(process.env.PINECONE_INDEX_NAME);
    const vectors = docsWithVectors.map((doc, i) => ({
        id: `chunk-${Date.now()}-${i}`,
        values: doc.embedding, 
        metadata: {
            content: doc.content || '', 
            source: doc.metadata?.source || '',
            socketId : doc.metadata.socketId  || ''
        },
    }));
    console.log(JSON.stringify(vectors[0]));
    await pineconeIndex.upsert(vectors);
}

export default storeInPinecone;
