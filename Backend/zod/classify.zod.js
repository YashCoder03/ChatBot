import {z} from "zod";

export const stateSchema = z.object({
  message: z.string(),
  id: z.string(),
  category: z.string().optional(),
  response: z.string().optional(),
});

export const answerSchema = z.object({
  header: z.string().describe("Main title or summary header for the response"),
  summary: z.string().describe("Short plain-text summary or TL;DR of the response"),
  content: z.array(z.string()).describe("Detailed explanation split into paragraphs or bullet points"),
  code: z
    .string()
    .describe("Code snippet as a single string, well-indented with line breaks"),
  language: z
    .string()
    .optional()
    .default("plaintext")
    .describe("Programming language of the code, e.g., 'js', 'python'"),
  tips: z
    .array(z.string())
    .optional()
    .default([])
    .describe("Optional tips or additional recommendations"),
  references: z
    .array(z.string())
    .optional()
    .default([])
    .describe("Optional list of reference links or documentation URLs"),
});