exports.handleMessage = (req, res) => {
  const { message } = req.body;
  console.log('REST message:', message);

  const reply = `🤖 Bot (REST): You said "${message}"`;
  res.json({ reply });
};

exports.handleUpload = (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  console.log(`PDF uploaded: ${req.file.filename}`);
  res.json({ reply: `Received file: ${req.file.originalname}` });
};
