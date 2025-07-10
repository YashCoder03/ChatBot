import {z} from "zod";

export const stateSchema = z.object({
  message: z.string(),
  id: z.string(),
  category: z.string().optional(),
  response: z.string().optional(),
});
