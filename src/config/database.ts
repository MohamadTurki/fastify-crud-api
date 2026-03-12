import { env } from "../utils/env"

const { DB_URL } = env

export function getConnectionString(): string {
  return DB_URL
}
