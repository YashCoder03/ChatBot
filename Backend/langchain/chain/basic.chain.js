import mistral from "../../config/mistral.config.js";
import { RunnableSequence, RunnableMap } from "@langchain/core/runnables";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { answerSchema } from "../../zod/classify.zod.js";
import { baseChainPrompt } from "../promptTemplate/prompt.template.js";
import { StringOutputParser } from "@langchain/core/output_parsers";

const parser = new StructuredOutputParser(answerSchema);

export const getBaseChain = () => {
  const baseChain = RunnableSequence.from([
    RunnableMap.from({
      input: (input) => input.input,
      history: (input) => input.history,
      format_instructions: () => parser.getFormatInstructions(),
    }),
    baseChainPrompt,
    mistral,
    parser,
    (parsedOutput) => JSON.stringify(parsedOutput, null, 2),
  ]);

  return baseChain;
};
