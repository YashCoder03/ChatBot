import loadPDFChunks  from './loaders/pdf.loader.js';
import  embedder   from './embedding/embedder.js';
import  storeInPinecone  from './vectorstores/pinecone.stores.js';
import { promises as fs } from 'fs';

const processPDF = async (filePath,socketId) => {
  const documents = await loadPDFChunks(filePath);
  const vectors = await embedder(documents,socketId);
  await storeInPinecone(vectors);
  fs.unlink(filePath);
};

export default processPDF;