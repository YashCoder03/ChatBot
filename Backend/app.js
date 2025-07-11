import express from "express"
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import chatRoutes from "./routes/chat.routes.js";
import dotenv from'dotenv'
import { getHistoricalData } from "./handler/chartData.handler.js";
dotenv.config()

const app = express();

// getHistoricalData()
// Middleware
app.use(cors());
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', chatRoutes);

// Fallback route
app.get('/', (req, res) => {
  res.send('🤖 Chatbot Backend is running!');
});

export default app;
