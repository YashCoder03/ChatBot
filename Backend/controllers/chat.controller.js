import processPDF from "../langchain/processPipeline.js";
import { getIO } from "../config/socket.config.js";


const handleMessage = (req, res) => {
  const { message } = req.body;
  console.log('REST message:', message);

  const reply = `🤖 Bot (REST): You said "${message}"`;
  res.json({ reply });
};

const handleUpload = async(req, res) => {
  const io = getIO();
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  console.log(`PDF uploaded: ${req.file.filename}`);

  await processPDF(req.file.path,req.body.socketId);
  
  io.emit("bot_message", { reply: "PDF file Uploaded" });
  res.json({ reply: `Received file: ${req.file.originalname}` });
};

export {
  handleMessage,
  handleUpload
}