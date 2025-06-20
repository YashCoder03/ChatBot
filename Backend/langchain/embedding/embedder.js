import mistralembedding from "../../config/mistralembedding.config.js";

const embedder = async(chunks,socketId) => {
    const texts = chunks.map(doc => doc.pageContent);
    
    const vectors = await mistralembedding.embedDocuments(texts);
    console.log(vectors[0]);
    return chunks.map((doc, i) => ({
        metadata: {
            ...doc.metadata,
            socketId,
        },
        content: doc.pageContent,
        embedding: vectors[i],
    }));

}

export default embedder;