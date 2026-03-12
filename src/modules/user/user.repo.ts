import { PostgresDb } from '@fastify/postgres'
import { UserDto, UserCreateDto, UserUpdateDto } from './user.dto'

type User = (typeof UserDto)['out']
type UserCreate = (typeof UserCreateDto)['in']
type UserUpdate = (typeof UserUpdateDto)['in']

export class UserRepository {
  constructor(private readonly pg: PostgresDb) {}

  async create(data: UserCreate): Promise<Omit<User, 'password'>> {
    const { name, email, password } = data
    const result = await this.pg.query(
      'INSERT INTO "user" (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at, updated_at',
      [name, email, password],
    )
    return result.rows[0]
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.pg.query('SELECT * FROM "user" WHERE email = $1', [email])
    return result.rows[0] || null
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const result = await this.pg.query('SELECT id, name, email, created_at, updated_at FROM "user" ORDER BY id')
    return result.rows
  }

  async findById(id: number): Promise<Omit<User, 'password'> | null> {
    const result = await this.pg.query('SELECT id, name, email, created_at, updated_at FROM "user" WHERE id = $1', [id])
    return result.rows[0] || null
  }

  async update(id: number, data: UserUpdate): Promise<Omit<User, 'password'> | null> {
    const { name, email, password } = data
    const updates: string[] = []
    const values: Array<string | number> = []
    let paramIndex = 1

    if (name) {
      updates.push(`name = $${paramIndex++}`)
      values.push(name)
    }
    if (email) {
      updates.push(`email = $${paramIndex++}`)
      values.push(email)
    }
    if (password) {
      updates.push(`password = $${paramIndex++}`)
      values.push(password)
    }

    if (updates.length === 0) {
      return this.findById(id)
    }

    updates.push('updated_at = CURRENT_TIMESTAMP')
    values.push(id)

    const query = `UPDATE "user" SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING id, name, email, created_at, updated_at`
    const result = await this.pg.query(query, values)
    return result.rows[0] || null
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.pg.query('DELETE FROM "user" WHERE id = $1', [id])
    return result.rowCount > 0
  }
}
