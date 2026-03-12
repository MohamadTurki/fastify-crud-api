import { z } from 'zod'
import { createDto } from '../../utils/dto'

export const UserDto = createDto(
  z.object({
    id: z.coerce.number().int().positive(),
    name: z.string().min(3).max(40),
    email: z.email(),
    password: z.string().min(6),
    created_at: z.string(),
    updated_at: z.string(),
  }),
)

export const UserCreateDto = createDto(
  z.object({
    name: z.string().min(3).max(40),
    email: z.email(),
    password: z.string().min(6),
  }),
)

export const UserUpdateDto = createDto(UserCreateDto.schema.partial())

export const UserIdDto = createDto(
  z.object({
    id: z.coerce.number().int().positive(),
  }),
)

export const LoginUserDto = createDto(
  z.object({
    email: z.email(),
    password: z.string().min(6),
  }),
)
