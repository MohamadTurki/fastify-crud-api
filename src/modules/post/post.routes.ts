import '@fastify/swagger'
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { PostDto, PostIdDto, PostUpdateDto } from './post.dto'
import { PostService } from './post.service'
import { TAGS } from '../../config/tags'
import { StatusCodes } from 'http-status-codes'

export default async function postRoutes(fastify: FastifyInstance) {
  type PostDto = (typeof PostDto)['in']
  type UpdatePostDto = (typeof PostUpdateDto)['in']

  const postService = new PostService(fastify.pg)

  fastify.post(
    '/posts',
    { schema: { body: PostDto.schema, tags: [TAGS.POSTS] } },
    async (request: FastifyRequest<{ Body: PostDto }>, reply: FastifyReply) => {
      const post = await postService.create(request.body)
      return reply.code(StatusCodes.CREATED).send(post)
    },
  )

  fastify.get(
    '/posts/list',
    { schema: { tags: [TAGS.POSTS] } },
    async (_request: FastifyRequest, reply: FastifyReply): Promise<PostDto[]> => {
      const posts = await postService.findAll()
      return reply.code(StatusCodes.OK).send(posts)
    },
  )

  fastify.get(
    '/posts/:id',
    {
      schema: {
        params: PostIdDto.schema,
        tags: [TAGS.POSTS],
      },
    },
    async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
      const post = await postService.findById(request.params.id)
      if (!post) {
        return reply.code(StatusCodes.NOT_FOUND).send({ error: 'Post not found' })
      }
      return reply.code(StatusCodes.OK).send(post)
    },
  )

  fastify.put(
    '/posts/:id',
    {
      schema: {
        params: PostIdDto.schema,
        body: PostUpdateDto.schema,
        tags: [TAGS.POSTS],
      },
    },
    async (request: FastifyRequest<{ Params: { id: number }; Body: UpdatePostDto }>, reply: FastifyReply) => {
      const updatedPost = await postService.update(request.params.id, request.body)
      if (!updatedPost) {
        return reply.code(StatusCodes.NOT_FOUND).send({ error: 'Post not found' })
      }
      return reply.send(updatedPost)
    },
  )

  fastify.delete(
    '/posts/:id',
    {
      schema: {
        params: PostIdDto.schema,
        tags: [TAGS.POSTS],
      },
    },
    async (request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) => {
      const deleted = await postService.remove(request.params.id)
      if (!deleted) {
        return reply.code(StatusCodes.NOT_FOUND).send({ error: 'Post not found' })
      }
      return reply.code(StatusCodes.NO_CONTENT).send()
    },
  )
}
