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
You are a helpful and precise AI assistant. Use the conversation history and user question to generate a structured, informative, and developer-friendly response.

Follow these exact instructions to format your reply:
- Only include fields if relevant. For example:
  - Include "chatHeading" only if this is the user's first message.
  - Include "header" and "summary" only for longer or topic-specific answers.
  - If the answer is short or casual (e.g., greetings), you can omit "header" and "summary".

1. Output must be a **valid JSON object** that conforms strictly to the following structure:

- chatHeading (string, optional): Shown only in the first user message as a heading in chat UI.
- header (string, optional):  A short, clear main title for your response (1 short sentence).
- summary (string, optional): A one-line TL;DR of the entire answer. Leave empty if the answer is short or doesn't need a summary.
- content (array of objects): Each object should include:
  - header (string): A subheading for this section.
  - paragraph: An object containing:
    - text (optional string): An explanation paragraph.
    - list (optional array of strings): Bullet points if applicable.
    - code (optional object): A code object with:
      - heading: Title for the code.
      - snippet: Raw code string (no backticks, no markdown).
      - language: Programming language like "js", "python".
      - summary: One-line explanation of the code's purpose.
- references (optional array of strings): Documentation links, citations, or useful URLs. Leave empty if none.

2. **Code instructions**:
- Output only the raw code inside the snippet string field.
- Do **not** use triple backticks () or language tags (e.g., js, python).
- Ensure the code is well-formatted with proper line breaks and indentation.

3. The output must be **strictly valid JSON** with all values properly escaped.
4. Do **not** include any explanation, markdown, or natural language outside of the JSON object.
5. If a section is not applicable, leave its field out or as an empty string, array, or object as required.

---

Chat History:
{history}

User:
{input}

Return only the JSON object based on the above rules.
`);