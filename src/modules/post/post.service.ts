import { PostgresDb } from "@fastify/postgres"
import type { PostDto, UpdatePostDto } from "./post.schema"

export class PostService {
  constructor(private readonly pg: PostgresDb) {}

  async create(data: PostDto): Promise<PostDto> {
    const { title, description } = data
    const result = await this.pg.query(
      "INSERT INTO post (title, description) VALUES ($1, $2) RETURNING *",
      [title, description],
    )
    return result.rows[0]
  }

  async findAll(): Promise<PostDto[]> {
    const result = await this.pg.query("SELECT * FROM post ORDER BY id")
    return result.rows
  }

  async findById(id: number): Promise<PostDto | undefined> {
    const result = await this.pg.query("SELECT * FROM post WHERE id = $1", [id])
    return result.rows[0]
  }

  async update(id: number, data: UpdatePostDto): Promise<PostDto | null> {
    const entries = Object.entries(data).filter(
      ([, value]) => value !== undefined,
    )

    if (entries.length === 0) {
      return null
    }

    const values: Array<string | number> = entries.map(
      ([, value]) => value as string,
    )
    const queryUpdates = entries.map(([key], index) => `${key} = $${index + 1}`)
    values.push(id)
    const idPlaceholder = `$${values.length}`

    const result = await this.pg.query(
      `UPDATE post SET ${queryUpdates.join(", ")} WHERE id = ${idPlaceholder} RETURNING *`,
      values,
    )
    return result.rows[0] ?? null
  }

  async remove(id: number): Promise<boolean> {
    const result: any = await this.pg.query("DELETE FROM post WHERE id = $1", [
      id,
    ])
    return result.rowCount > 0
  }
}
