import type { FastifyReply, FastifyRequest } from "fastify"
import { StatusCodes } from "http-status-codes"
import type { PostDto } from "./post.schema"
import { PostService } from "./post.service"

export class PostController {
  constructor(private readonly postService: PostService) {}

  createPost = async (
    request: FastifyRequest<{ Body: PostDto }>,
    reply: FastifyReply,
  ) => {
    const post = await this.postService.create(request.body)
    return reply.code(StatusCodes.CREATED).send(post)
  }

  getPosts = async (_request: FastifyRequest, reply: FastifyReply) => {
    const posts = await this.postService.findAll()
    return reply.code(StatusCodes.OK).send(posts)
  }

  getPost = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const post = await this.postService.findById(Number(request.params.id))
    if (!post) {
      return reply.code(StatusCodes.NOT_FOUND).send({ error: "Post not found" })
    }
    return reply.code(StatusCodes.OK).send(post)
  }

  updatePost = async (
    request: FastifyRequest<{ Params: { id: string }; Body: PostDto }>,
    reply: FastifyReply,
  ) => {
    const updatedPost = await this.postService.update(
      Number(request.params.id),
      request.body,
    )
    if (!updatedPost) {
      return reply.code(StatusCodes.NOT_FOUND).send({ error: "Post not found" })
    }
    return reply.send(updatedPost)
  }

  deletePost = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ) => {
    const deleted = await this.postService.remove(Number(request.params.id))
    if (!deleted) {
      return reply.code(StatusCodes.NOT_FOUND).send({ error: "Post not found" })
    }
    return reply.code(StatusCodes.NO_CONTENT).send()
  }

  deletePosts = async (_request: FastifyRequest, reply: FastifyReply) => {
    await this.postService.removeAll()
    return reply.code(StatusCodes.NO_CONTENT).send()
  }
}
