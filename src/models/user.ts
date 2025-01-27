import { z } from 'zod'

export const userRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
})

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
})

export const userListSchema = z.array(userSchema)

export type User = z.infer<typeof userSchema>
