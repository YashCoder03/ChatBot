import server from './server.js'
import {initSocket} from './config/socket.config.js'
import { initclassifyAgent } from './langchain/agent/classify.agent.js'

initSocket()
initclassifyAgent()