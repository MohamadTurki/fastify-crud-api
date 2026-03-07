import type { FastifyReply, FastifyRequest } from "fastify"
import { StatusCodes } from "http-status-codes"
import type { UpdateUserDto, UserDto } from "./account.schema"
import { AccountService } from "./account.service"

export class UserController {
  constructor(private readonly accountservice: AccountService) {}

  registerUser = async (
    request: FastifyRequest<{ Body: UserDto }>,
    reply: FastifyReply,
  ) => {
    const user = await this.accountservice.register(request.body)
    return reply.code(StatusCodes.CREATED).send(user)
  }

  loginUser = async (
    request: FastifyRequest<{ Body: UserDto }>,
    reply: FastifyReply,
  ) => {
    const { email, password } = request.body
    const user = await this.accountservice.login(email, password)

    if (!user) {
      return reply
        .code(StatusCodes.UNAUTHORIZED)
        .send({ error: "Invalid email or password" })
    }

    return reply.send(user)
  }

  getAccounts = async (request: FastifyRequest, reply: FastifyReply) => {
    const accounts = await this.accountservice.findAll()
    return reply.send(accounts)
  }

  getUser = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const user = await this.accountservice.findById(Number(request.params.id))
    if (!user)
      return reply.code(StatusCodes.NOT_FOUND).send({ error: "User not found" })
    return reply.send(user)
  }

  updateUser = async (
    request: FastifyRequest<{
      Params: { id: string }
      Body: UpdateUserDto
    }>,
    reply: FastifyReply,
  ) => {
    const updatedUser = await this.accountservice.update(
      Number(request.params.id),
      request.body,
    )
    if (!updatedUser)
      return reply.code(StatusCodes.NOT_FOUND).send({ error: "User not found" })
    return reply.send(updatedUser)
  }

  deleteUser = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const deleted: boolean = await this.accountservice.remove(
      Number(request.params.id),
    )
    if (!deleted)
      return reply.code(StatusCodes.NOT_FOUND).send({ error: "User not found" })
    return reply.code(StatusCodes.NO_CONTENT).send()
  }

  deleteAccounts = async (request: FastifyRequest, reply: FastifyReply) => {
    await this.accountservice.removeAll()
    return reply.code(StatusCodes.NO_CONTENT).send()
  }
}
