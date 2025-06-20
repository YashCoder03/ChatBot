import pc from "../../config/pinecone.config.js";

const getDocument = async (question,socketId) =>{
    const pineconeIndex = pc.Index(process.env.PINECONE_INDEX_NAME)
    const data = await pineconeIndex.query({
        vector : question,
        topK : 5,
        includeMetadata : true,
        filter: {
            socketId: socketId, 
        },
    })
    return data;
}

export default getDocument;
