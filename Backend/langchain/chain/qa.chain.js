import pc from "../../config/pinecone.config.js";
import mistral from "../../config/mistral.config.js";
import { PromptTemplate } from '@langchain/core/prompts';
import { Runnable, RunnableMap, RunnableSequence } from '@langchain/core/runnables';
import getDocument from "../vectorstores/pincecone.retriver.js";
import mistralembedding from "../../config/mistralembedding.config.js";
import { StringOutputParser } from '@langchain/core/output_parsers';

const pineconeIndex = pc.Index(process.env.PINECONE_INDEX_NAME);

const prompt = PromptTemplate.fromTemplate(`
    You are a helpful assistant. Use the following context to answer the question.
    
    Context: 
    {context}
    
    Question:
    {question}

    Answer:
`)
const getAnswer = async (question,socketId) => {
    const embeddQuery = await mistralembedding.embedQuery(question);
    const vectorData =await getDocument(embeddQuery,socketId);

    const context = vectorData.matches
    .map((m) => m.metadata?.content || '')
    .join('\n\n');

    const chain = RunnableSequence.from([
    RunnableMap.from({
            context: () => context,      // not async unless needed
            question: (input) => input.question,
        }),
        prompt,
        mistral,
        new StringOutputParser(),
    ]);

    const results = await chain.invoke({question});
    return results;
}

export default getAnswer;