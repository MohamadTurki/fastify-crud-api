import { env } from '../utils/env'

// TODO: Add support for multiple databases and connection pooling

const { DB_URL } = env

export function getConnectionString(): string {
  return DB_URL
}
