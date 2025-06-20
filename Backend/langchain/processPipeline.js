import loadPDFChunks  from './loaders/pdf.loader.js';
import  embedder   from './embedding/embedder.js';
import  storeInPinecone  from './vectorstores/pinecone.stores.js';

const processPDF = async (filePath) => {
  const documents = await loadPDFChunks(filePath);
  const vectors = await embedder(documents);
  await storeInPinecone(vectors);
};

export default processPDF;