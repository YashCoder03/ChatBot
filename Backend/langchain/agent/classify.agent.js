import { StateGraph, END, START } from "@langchain/langgraph";
import { classifyChain } from "../../handler/message.handler.js";
import { handleGeneralQuestion } from "../../handler/message.handler.js";
import getAnswer from "../chain/qa.chain.js";
import { stateSchema } from "../../zod/classify.zod.js";




let agentGraph;
export const initclassifyAgent = async() => {

    const graph = new StateGraph(stateSchema);
    graph.addNode("classify",classifyNode);
    graph.addNode("chat",generalNode);
    graph.addNode("pdf",QANode)

    graph.addEdge(START,"classify");
    graph.addEdge("pdf",END);
    graph.addEdge("chat",END);
    
    graph.addConditionalEdges("classify",state => state.category === "PDF" ? "pdf" : "chat",["pdf", "chat"]);
    
    agentGraph = graph.compile();
}

export const classifyAgent = async(message,id) =>{
    const res = await agentGraph.invoke({message,id});
    return res.response;
}

const classifyNode = async(state) => {
    const answer = await classifyChain(state.message,state.id);
    state.category = answer;
    return state;
}

const generalNode = async(state) => {
    
    const answer = await handleGeneralQuestion(state.message,state.id);
    state.response = answer;
    console.log(answer)
    return state;
}

const QANode = async(state) => {
    const answer = await getAnswer(state.message,state.id);
    state.response = answer;
    return state;
}