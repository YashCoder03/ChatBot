const express = require('express');
const { handleMessage, handleUpload } = require('../controllers/chat.controller');
const upload = require('../utils/multer.config');

const router = express.Router();

router.post('/message', handleMessage);
router.post('/upload', upload.single('file'), handleUpload);

module.exports = router;
    