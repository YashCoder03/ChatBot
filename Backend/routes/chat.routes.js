import express from "express";
import { handleMessage, handleUpload } from "../controllers/chat.controller.js"
import upload from '../utils/multer.config.js';

const router = express.Router();

router.post('/message', handleMessage);
router.post('/upload', upload.single('pdf'), handleUpload);

export default router;
    