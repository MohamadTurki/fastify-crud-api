export const databaseConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "yhyo_password",
  database: process.env.DB_NAME || "yhyo_db",
}

export function getConnectionString(): string {
  const { user, password, host, port, database } = databaseConfig
  return `postgres://${user}:${password}@${host}:${port}/${database}`
}
