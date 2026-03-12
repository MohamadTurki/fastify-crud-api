import "@fastify/swagger"
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { AccountService } from "./account.service"
import {
  accountSchema,
  IdAccountSchema,
  UpdateAccountSchema,
  UpdateUserDto,
  UserDto,
} from "./account.schema"
import { TAGS } from "../../config/tags"
import { StatusCodes } from "http-status-codes"

export default async function userRoutes(fastify: FastifyInstance) {
  const accountService = new AccountService(fastify.pg)

  fastify.post(
    "/account/register",
    { schema: { tags: [TAGS.ACCOUNT], body: accountSchema } },
    async (request: FastifyRequest<{ Body: UserDto }>, reply: FastifyReply) => {
      const user = await accountService.register(request.body)
      return reply.code(StatusCodes.CREATED).send(user)
    },
  )

  fastify.post(
    "/account/login",
    { schema: { tags: [TAGS.ACCOUNT], body: accountSchema } },
    async (request: FastifyRequest<{ Body: UserDto }>, reply: FastifyReply) => {
      const { email, password } = request.body
      const user = await accountService.login(email, password)

      if (!user) {
        return reply
          .code(StatusCodes.UNAUTHORIZED)
          .send({ error: "Invalid email or password" })
      }

      return reply.send(user)
    },
  )

  fastify.get(
    "/account/list",
    { schema: { tags: [TAGS.ACCOUNT] } },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const accounts = await accountService.findAll()
      return reply.send(accounts)
    },
  )

  fastify.get(
    "/account/:id",
    {
      schema: {
        params: IdAccountSchema,
        tags: [TAGS.ACCOUNT],
      },
    },
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply,
    ) => {
      const user = await accountService.findById(Number(request.params.id))
      if (!user)
        return reply
          .code(StatusCodes.NOT_FOUND)
          .send({ error: "User not found" })
      return reply.send(user)
    },
  )

  fastify.put(
    "/account/:id",
    {
      schema: {
        params: IdAccountSchema,
        body: UpdateAccountSchema,
        tags: [TAGS.ACCOUNT],
      },
    },
    async (
      request: FastifyRequest<{
        Params: { id: string }
        Body: UpdateUserDto
      }>,
      reply: FastifyReply,
    ) => {
      const updatedUser = await accountService.update(
        Number(request.params.id),
        request.body,
      )
      if (!updatedUser)
        return reply
          .code(StatusCodes.NOT_FOUND)
          .send({ error: "User not found" })
      return reply.send(updatedUser)
    },
  )

  fastify.delete(
    "/account/:id",
    {
      schema: {
        params: IdAccountSchema,
        tags: [TAGS.ACCOUNT],
      },
    },
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply,
    ) => {
      const deleted = await accountService.remove(Number(request.params.id))
      if (!deleted)
        return reply
          .code(StatusCodes.NOT_FOUND)
          .send({ error: "User not found" })
      return reply.code(StatusCodes.NO_CONTENT).send()
    },
  )
}
