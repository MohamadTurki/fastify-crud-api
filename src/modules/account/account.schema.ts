import { z } from "zod"

export const accountSchema = z.object({
  name: z.string().min(3).max(40),
  email: z.string().email(),
  password: z.string().min(6),
})

export const UpdateAccountSchema = z.object({
  name: z.string().min(3).max(40).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
})

export const IdAccountSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export type UserDto = z.infer<typeof accountSchema>

export type UpdateUserDto = z.infer<typeof UpdateAccountSchema>
