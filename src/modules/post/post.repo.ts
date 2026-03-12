import { PostgresDb } from '@fastify/postgres'
import { PostDto, PostUpdateDto } from './post.dto'

type Post = (typeof PostDto)['in']
type PostUpdate = (typeof PostUpdateDto)['in']

export class PostRepository {
  constructor(private readonly pg: PostgresDb) {}

  async create(data: Post): Promise<Post> {
    const { title, description } = data
    const result = await this.pg.query('INSERT INTO post (title, description) VALUES ($1, $2) RETURNING *', [
      title,
      description,
    ])
    return result.rows[0]
  }

  async findAll(): Promise<Post[]> {
    const result = await this.pg.query('SELECT * FROM post ORDER BY id')
    return result.rows
  }

  async findById(id: number): Promise<Post | undefined> {
    const result = await this.pg.query('SELECT * FROM post WHERE id = $1', [id])
    return result.rows[0]
  }

  async update(id: number, data: PostUpdate): Promise<Post | null> {
    const entries = Object.entries(data).filter(([, value]) => value !== undefined)

    if (entries.length === 0) {
      return null
    }

    const values: Array<string | number> = entries.map(([, value]) => value as string | number)
    const queryUpdates = entries.map(([key], index) => `${key} = $${index + 1}`)
    values.push(id)
    const idPlaceholder = `$${values.length}`

    const result = await this.pg.query(
      `UPDATE post SET ${queryUpdates.join(', ')} WHERE id = ${idPlaceholder} RETURNING *`,
      values,
    )
    return result.rows[0] ?? null
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.pg.query('DELETE FROM post WHERE id = $1', [id])
    return result.rowCount > 0
  }
}
