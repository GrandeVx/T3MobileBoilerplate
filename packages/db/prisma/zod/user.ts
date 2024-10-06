import * as z from "zod"

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  phone: z.string().nullish(),
  firstName: z.string().nullish(),
  lastName: z.string().nullish(),
  notifications: z.boolean(),
  notificationToken: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})
