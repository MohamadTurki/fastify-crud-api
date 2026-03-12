import { PostgresDb } from '@fastify/postgres'
import type { PostDto, PostUpdateDto } from './post.dto'
import { PostRepository } from './post.repo'

type PostDto = (typeof PostDto)['in']
type PostUpdateDto = (typeof PostUpdateDto)['in']

export class PostService {
  private readonly postRepo: PostRepository

  constructor(pg: PostgresDb) {
    this.postRepo = new PostRepository(pg)
  }

  async create(data: PostDto): Promise<PostDto> {
    return this.postRepo.create(data)
  }

  async findAll(): Promise<PostDto[]> {
    return this.postRepo.findAll()
  }

  async findById(id: number): Promise<PostDto | undefined> {
    return this.postRepo.findById(id)
  }

  async update(id: number, data: PostUpdateDto): Promise<PostDto | null> {
    return this.postRepo.update(id, data)
  }

  async remove(id: number): Promise<boolean> {
    return this.postRepo.remove(id)
  }
}
