import { z } from 'zod'
import { createDto } from '../../utils/dto'

export const PostDto = createDto(
  z.object({
    title: z.string().min(3).max(255),
    description: z.string().min(10),
  }),
)

export const PostUpdateDto = createDto(
  z.object({
    title: z.string().min(3).max(255).optional(),
    description: z.string().min(10).optional(),
  }),
)

export const PostIdDto = createDto(
  z.object({
    id: z.coerce.number().int().positive(),
  }),
)
