import "@fastify/swagger"
import type { FastifyInstance } from "fastify"
import { PostController } from "./post.controller"
import { IdPostSchema, PostSchema, UpdatePostSchema } from "./post.schema"
import { PostService } from "./post.service"
import { TAGS } from "../../config/tags"

export default async function postRoutes(fastify: FastifyInstance) {
  const postService = new PostService(fastify.pg)
  const postController = new PostController(postService)

  fastify.post(
    "/posts",
    { schema: { body: PostSchema, tags: [TAGS.POSTS] } },
    postController.createPost,
  )

  fastify.get(
    "/posts/list",
    { schema: { tags: [TAGS.POSTS] } },
    postController.getPosts,
  )

  fastify.get(
    "/posts/:id",
    {
      schema: {
        params: IdPostSchema,
        tags: [TAGS.POSTS],
      },
    },
    postController.getPost,
  )

  fastify.put(
    "/posts/:id",
    {
      schema: {
        params: IdPostSchema,
        body: UpdatePostSchema,
        tags: [TAGS.POSTS],
      },
    },
    postController.updatePost,
  )

  fastify.delete(
    "/posts/:id",
    {
      schema: {
        params: IdPostSchema,
        tags: [TAGS.POSTS],
      },
    },
    postController.deletePost,
  )

  fastify.delete(
    "/posts",
    { schema: { tags: [TAGS.POSTS] } },
    postController.deletePosts,
  )
}
