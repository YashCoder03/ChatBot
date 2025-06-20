import mistral from "../../config/mistralembedding.config.js";

const embedder = async(chunks) => {
    const texts = chunks.map(doc => doc.pageContent);
    
    const vectors = await mistral.embedDocuments(texts);
    console.log(vectors[0]);
    return chunks.map((doc, i) => ({
        metadata: doc.metadata || {},
        content: doc.pageContent,
        embedding: vectors[i],
    }));

}

export default embedder;