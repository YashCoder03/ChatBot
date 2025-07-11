import { z } from "zod";

export const itinerarySchema = z.object({
  summary: z.string(),
  number_of_days: z.number(),
  travel: z.object({
    mode: z.string(),
    provider: z.string(),
    price: z.string(),
    duration: z.string(),
    departure_time: z.string(),
    arrival_time: z.string(),
    stops: z.array(z.string()).optional(),
  }),
  hotel: z.object({
    name: z.string(),
    price_per_night: z.string(),
    total_price: z.string(),
    address: z.string(),
  }),
  restaurant: z.object({
    name: z.string(),
    type: z.string(),
    price_range: z.string(),
    specialties: z.array(z.string()),
    address: z.string(),
  }),
  daily_plan: z.array(
    z.object({
      day: z.string(),
      activities: z.array(z.string()),
    })
  ),
});
