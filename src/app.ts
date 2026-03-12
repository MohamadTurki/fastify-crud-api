import Fastify from "fastify"
import fastifyPostgres from "@fastify/postgres"
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod"
import fastifySwagger from "@fastify/swagger"
import scalarApiReference from "@scalar/fastify-api-reference"
import { getConnectionString } from "./config/database"
import postRoutes from "./modules/post/post.routes"
import accountRoutes from "./modules/user/user.routes"
import { env } from "node:process"

const PORT = Number(env.PORT) || 4000

export async function createApp() {
  const fastify = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>()
  fastify.setValidatorCompiler(validatorCompiler)
  fastify.setSerializerCompiler(serializerCompiler)

  await fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: "accounts, Posts Rest API",
        description: "API documentation for Aslan Assignment",
        version: "",
      },
    },
    transform: jsonSchemaTransform,
  })

  await fastify.register(scalarApiReference, {
    routePrefix: "/docs",
  })

  fastify.register(fastifyPostgres, {
    connectionString: getConnectionString(),
  })

  fastify.register(accountRoutes)

  fastify.register(postRoutes)

  return fastify
}

export async function start(app: Awaited<ReturnType<typeof createApp>>) {
  try {
    await app.listen({ port: PORT })
  } catch (error) {
    app.log.error(error)
    process.exit(1)
  }
}

export const app = await createApp()
