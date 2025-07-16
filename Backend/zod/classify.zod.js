import {z} from "zod";

export const stateSchema = z.object({
  message: z.string(),
  id: z.string(),
  category: z.string().optional(),
  response: z.string().optional(),
});

export const answerSchema = z.object({
  chatHeading: z
    .string()
    .optional()
    .default("")
    .describe("A short greeting or title shown only at the start of the chat"),

  header: z
    .string()
    .optional()
    .default("")
    .describe("Main title or summary for the full response, optional for short answers"),

  summary: z
    .string()
    .optional()
    .default("")
    .describe("TL;DR or short plain-text summary of the response"),

  content: z.array(
    z.object({
      header: z
        .string()
        .describe("Section title for this content block"),

      paragraph: z.object({
        text: z
          .string()
          .optional()
          .default("")
          .describe("Plain text explanation paragraph"),

        list: z
          .array(z.string())
          .optional()
          .default([])
          .describe("Bullet point list of related items"),

        code: z.object({
            heading: z.string().describe("Title of the code snippet"),
            snippet: z
              .string()
              .describe("Full raw code as a single string, properly formatted"),
            language: z
              .string()
              .describe("Language of the code, e.g., 'js', 'python'"),
            summary: z
              .string()
              .describe("Short summary of what the code does")
          })
          .optional()
      })
    })
  ),

  references: z
    .array(z.string())
    .optional()
    .default([])
    .describe("List of URLs, documentation links, or citations for the entire response")
}).strict();
