import "@fastify/swagger"
import type { FastifyInstance } from "fastify"
import { UserController } from "./account.controller"
import { AccountService } from "./account.service"
import {
  accountSchema,
  IdAccountSchema,
  UpdateAccountSchema,
} from "./account.schema"
import { TAGS } from "../../config/tags"

export default async function userRoutes(fastify: FastifyInstance) {
  const accountService = new AccountService(fastify.pg)
  const userController = new UserController(accountService)

  fastify.post(
    "/account/register",
    { schema: { tags: [TAGS.ACCOUNT], body: accountSchema } },
    userController.registerUser,
  )

  fastify.post(
    "/account/login",
    { schema: { tags: [TAGS.ACCOUNT], body: accountSchema } },
    userController.loginUser,
  )

  fastify.get(
    "/account/list",
    { schema: { tags: [TAGS.ACCOUNT] } },
    userController.getAccounts,
  )

  fastify.get(
    "/account/:id",
    {
      schema: {
        params: IdAccountSchema,
        tags: [TAGS.ACCOUNT],
      },
    },
    userController.getUser,
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
    userController.updateUser,
  )

  fastify.delete(
    "/account/:id",
    {
      schema: {
        params: IdAccountSchema,
        tags: [TAGS.ACCOUNT],
      },
    },
    userController.deleteUser,
  )

  fastify.delete(
    "/account",
    { schema: { tags: [TAGS.ACCOUNT] } },
    userController.deleteAccounts,
  )
}
