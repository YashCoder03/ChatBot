import pc from "../../config/pinecone.config.js";

const pineconeIndex = pc.Index(process.env.PINECONE_INDEX_NAME)

const deleteRecordsBySocketID = async(socketId) => {

    await pineconeIndex._deleteMany({
        socketId : {
            $eq : socketId
        }
    })
    return true;
}

export default deleteRecordsBySocketID;