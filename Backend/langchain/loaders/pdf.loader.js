import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const loadPDFChunks = async(filePath) => {
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();
    
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    
    const splitDocs = await textSplitter.splitDocuments(docs);
    return splitDocs;
}

export default loadPDFChunks