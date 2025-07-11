import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";

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

export const baseChainPrompt = ChatPromptTemplate.fromTemplate(`
You are a helpful, precise assistant. Use the chat history to answer the user's question clearly and thoroughly.

Chat History:
{history}

User: {input}

When providing your answer, structure it as JSON with the following fields:

- "header": A short, clear main title for your response (1 short sentence).
- "summary": A one-line summary (TL;DR) of the entire response.
- "content": A list of detailed explanation points or paragraphs (array of strings).
- "code": The full, raw code as a single string. If the question does NOT require code, leave this field as an empty string "".
- "language": The programming language of the code (e.g., "js", "python"). If the question does NOT require code, leave this field as an empty string "".
- "tips": Optional tips or best practices related to the topic (array of strings). Leave empty if not applicable.
- "references": Optional external references, documentation links, or further reading URLs (array of strings). Leave empty if not applicable.

Important instructions for code field:
- Only include raw code as a string.
- Do NOT wrap it in any markdown backticks (\`\`\`).
- Do not include language tags (like \`\`\`js).
- The code must be well-indented and properly formatted with line breaks and spaces.

Make sure the JSON output is strictly valid and properly escaped. Only return JSON, with no additional explanation or markdown formatting.

Please format your entire answer as JSON using these instructions:

{format_instructions}

Assistant:
`);