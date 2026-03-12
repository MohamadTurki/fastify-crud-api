import '@fastify/swagger'
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { UserService } from './user.service'
import { LoginUserDto, UserIdDto, UserUpdateDto, UserCreateDto } from './user.dto'
import { TAGS } from '../../config/tags'
import { StatusCodes } from 'http-status-codes'

export default async function userRoutes(fastify: FastifyInstance) {
  type UserCreateBody = (typeof UserCreateDto)['in']
  type UserUpdateBody = (typeof UserUpdateDto)['in']
  type LoginDataBody = (typeof LoginUserDto)['in']
  type UserIdParams = (typeof UserIdDto)['in']
  const userService = new UserService(fastify.pg)

  fastify.post(
    '/user/register',
    { schema: { tags: [TAGS.ACCOUNT], body: UserCreateDto.schema } },
    async (request: FastifyRequest<{ Body: UserCreateBody }>, reply: FastifyReply) => {
      const user = await userService.register(request.body)
      return reply.code(StatusCodes.CREATED).send(user)
    },
  )

  fastify.post(
    '/user/login',
    { schema: { tags: [TAGS.ACCOUNT], body: LoginUserDto.schema } },
    async (request: FastifyRequest<{ Body: LoginDataBody }>, reply: FastifyReply) => {
      const { email, password } = request.body
      const user = await userService.login({ email, password })

      if (!user) {
        return reply.code(StatusCodes.UNAUTHORIZED).send({ error: 'Invalid email or password' })
      }

      return reply.send(user)
    },
  )

  fastify.get(
    '/user/list',
    { schema: { tags: [TAGS.ACCOUNT] } },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const users = await userService.findAll()
      return reply.send(users)
    },
  )

  fastify.get(
    '/user/:id',
    {
      schema: {
        params: UserIdDto.schema,
        tags: [TAGS.ACCOUNT],
      },
    },
    async (request: FastifyRequest<{ Params: UserIdParams }>, reply: FastifyReply) => {
      const user = await userService.findById(Number(request.params.id))
      if (!user) return reply.code(StatusCodes.NOT_FOUND).send({ error: 'User not found' })
      return reply.send(user)
    },
  )

  fastify.put(
    '/user/:id',
    {
      schema: {
        params: UserIdDto.schema,
        body: UserUpdateDto.schema,
        tags: [TAGS.ACCOUNT],
      },
    },
    async (
      request: FastifyRequest<{
        Params: UserIdParams
        Body: UserUpdateBody
      }>,
      reply: FastifyReply,
    ) => {
      const updatedUser = await userService.update(Number(request.params.id), request.body)
      if (!updatedUser) return reply.code(StatusCodes.NOT_FOUND).send({ error: 'User not found' })
      return reply.send(updatedUser)
    },
  )

  fastify.delete(
    '/user/:id',
    {
      schema: {
        params: UserIdDto.schema,
        tags: [TAGS.ACCOUNT],
      },
    },
    async (request: FastifyRequest<{ Params: UserIdParams }>, reply: FastifyReply) => {
      const deleted = await userService.remove(Number(request.params.id))
      if (!deleted) return reply.code(StatusCodes.NOT_FOUND).send({ error: 'User not found' })
      return reply.code(StatusCodes.NO_CONTENT).send()
    },
  )
}
