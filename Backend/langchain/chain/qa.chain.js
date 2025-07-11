import pc from "../../config/pinecone.config.js";
import mistral from "../../config/mistral.config.js";
import { PromptTemplate } from '@langchain/core/prompts';
import { Runnable, RunnableMap, RunnableSequence } from '@langchain/core/runnables';
import getDocument from "../vectorstores/pincecone.retriver.js";
import mistralembedding from "../../config/mistralembedding.config.js";
import { StringOutputParser } from '@langchain/core/output_parsers';
import { getIO } from "../../config/socket.config.js";
import { z } from "zod";
import { StructuredOutputParser } from "@langchain/core/output_parsers";

const pineconeIndex = pc.Index(process.env.PINECONE_INDEX_NAME);


const answerSchema = z.object({
  header: z.string(),
  content: z.array(z.string()),
  code: z.string(),
});

// Create parser
const parser = new StructuredOutputParser(answerSchema);

const prompt = PromptTemplate.fromTemplate(`
You are a helpful assistant. Use the following context to answer the question.

Context: 
{context}

Question:
{question}

Please format your answer as JSON using these instructions:

{format_instructions}

Answer:
`);
const getAnswer = async (question,id) => {
    const embeddQuery = await mistralembedding.embedQuery(question);
    const vectorData =await getDocument(embeddQuery,id);

    const context = vectorData.matches
    .map((m) => m.metadata?.content || '')
    .join('\n\n');

    const chain = RunnableSequence.from([
    RunnableMap.from({
            context: () => context,      // not async unless needed
            question: (input) => input.question,
            format_instructions: () => parser.getFormatInstructions(),
        }),
        prompt,
        mistral,
        new StringOutputParser(),
    ]);

    const answer = await chain.invoke({ question });
    console.log(answer);
    return answer;
    
}

export default getAnswer;