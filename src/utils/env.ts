import { z } from "zod"
import { config } from "dotenv"
import path from "node:path"
import { error } from "node:console"

const nodeEnvs: string[] = ["example", "development", "production", "test"]

const envPath = path.resolve(
  process.cwd(),
  "envs",
  `.env.${process.env.NODE_ENV}`,
)

const result = config({ path: envPath })

if (result.error) {
  throw error(
    `Could not load environment variables from ${envPath}. Falling back to default .env file.`,
  )
}

export const envSchema = z.object({
  NODE_ENV: z.enum(nodeEnvs),
  PORT: z.string().default("3000"),
  DB_URL: z.string(),
})

export const env = envSchema.parse(process.env)
