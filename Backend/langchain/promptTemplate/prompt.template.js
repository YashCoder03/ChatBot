import { PromptTemplate } from "@langchain/core/prompts";

export const itineraryPrompt = PromptTemplate.fromTemplate(`
You are a top travel planner assistant.

Plan a detailed trip from {source} to {destination} with these preferences:
- Travel mode: {mode}
- Food preference: {food}
- Budget: {budget}
- Number of days: {number_of_days}

Your response must include:
1. Travel details (mode, provider, price, duration, departure/arrival time, stops)
2. Recommended hotel (name, price per night, total price, address)
3. Recommended restaurant (name, type, price range, specialties, address)
4. A daily plan for each day, with activities or suggestions

Format your response as JSON using these instructions:

{format_instructions}

Answer:
`);