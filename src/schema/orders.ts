import { z } from "zod";

export const ordersSchema = z.object({
  email: z.string().email().min(1, "Required"),
});


