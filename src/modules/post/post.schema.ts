import { z } from "zod"

export const PostSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().min(10),
})

export const UpdatePostSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  description: z.string().min(10).optional(),
})

export const IdPostSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export type UpdatePostDto = z.infer<typeof UpdatePostSchema>

export type PostDto = z.infer<typeof PostSchema>
