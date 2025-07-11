import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence, RunnableMap } from "@langchain/core/runnables";
import mistral from "../../config/mistral.config.js";
import {  itineraryPrompt } from "../promptTemplate/prompt.template.js";
import { itinerarySchema } from "../../zod/travel.zod.js";

const parser = new StructuredOutputParser(itinerarySchema);

export const getItineraryChain = () => {
  return RunnableSequence.from([
    RunnableMap.from({
      source: (input) => input.source,
      destination: (input) => input.destination,
      mode: (input) => input.mode,
      food: (input) => input.food,
      budget: (input) => input.budget,
      number_of_days: (input) => input.number_of_days,
      format_instructions: () => parser.getFormatInstructions(),
    }),
    itineraryPrompt,
    mistral,
    parser,
    // To make it safe with memory, stringify
    (parsed) => JSON.stringify(parsed),
  ]);
};
