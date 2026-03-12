import { PostgresDb } from "@fastify/postgres"
import type { UpdateUserDto, UserDto } from "./account.schema"
import { comparePassword, hashPassword } from "../../utils/hash"

export class AccountService {
  constructor(private readonly pg: PostgresDb) {}

  async register(data: UserDto): Promise<Omit<UserDto, "password">> {
    const { name, email, password } = data
    const hashedPassword = await hashPassword(password)
    const result = await this.pg.query(
      "INSERT INTO account (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at, updated_at",
      [name, email, hashedPassword],
    )
    return result.rows[0]
  }

  async login(
    email: string,
    password: string,
  ): Promise<Omit<UserDto, "password"> | null> {
    const result = await this.pg.query(
      "SELECT * FROM account WHERE email = $1",
      [email],
    )
    const user = result.rows[0]

    if (!user) return null

    const isValidPassword = await comparePassword(password, user.password)
    if (!isValidPassword) return null

    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  async findAll(): Promise<Omit<UserDto, "password">[]> {
    const result = await this.pg.query(
      "SELECT id, name, email, created_at, updated_at FROM account ORDER BY id",
    )
    return result.rows
  }

  async findById(id: number): Promise<Omit<UserDto, "password"> | undefined> {
    const result = await this.pg.query(
      "SELECT id, name, email, created_at, updated_at FROM account WHERE id = $1",
      [id],
    )
    return result.rows[0]
  }

  async update(
    id: number,
    data: UpdateUserDto,
  ): Promise<Omit<UserDto, "password"> | null> {
    const { name, email, password } = data
    const updates: string[] = []
    const values: Array<string | number> = []
    let paramIndex = 1

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`)
      values.push(name)
    }
    if (email !== undefined) {
      updates.push(`email = $${paramIndex++}`)
      values.push(email)
    }
    if (password !== undefined) {
      const hashedPassword = await hashPassword(password)
      updates.push(`password = $${paramIndex++}`)
      values.push(hashedPassword)
    }

    if (updates.length === 0) return null

    updates.push(`updated_at = CURRENT_TIMESTAMP`)
    values.push(id)

    const query = `UPDATE account SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING id, name, email, created_at, updated_at`
    const result = await this.pg.query(query, values)
    return result.rows[0] || null
  }

  async remove(id: number): Promise<boolean> {
    const result: any = await this.pg.query(
      "DELETE FROM account WHERE id = $1",
      [id],
    )
    return result.rowCount > 0
  }
}
