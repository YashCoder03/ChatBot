import processPDF from "../langchain/processPipeline.js";

const handleMessage = (req, res) => {
  const { message } = req.body;
  console.log('REST message:', message);

  const reply = `🤖 Bot (REST): You said "${message}"`;
  res.json({ reply });
};

const handleUpload = (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  console.log(`PDF uploaded: ${req.file.filename}`);

  processPDF(req.file.path,req.body.socketId);

  res.json({ reply: `Received file: ${req.file.originalname}` });
};

export {
  handleMessage,
  handleUpload
}