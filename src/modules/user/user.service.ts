import { PostgresDb } from '@fastify/postgres'
import { UserDto, UserCreateDto, LoginUserDto, UserUpdateDto } from './user.dto'
import { comparePassword, hashPassword } from '../../utils/hash'
import { UserRepository } from './user.repo'

type User = (typeof UserDto)['out']
type UserCreate = (typeof UserCreateDto)['in']
type UserUpdate = (typeof UserUpdateDto)['in']
type LoginData = (typeof LoginUserDto)['in']

export class UserService {
  private readonly userRepo: UserRepository

  constructor(pg: PostgresDb) {
    this.userRepo = new UserRepository(pg)
  }

  async register(data: UserCreate): Promise<Omit<User, 'password'>> {
    const { name, email, password } = data
    const hashedPassword = await hashPassword(password)

    return this.userRepo.create({
      name,
      email,
      password: hashedPassword,
    })
  }

  async login(data: LoginData): Promise<Omit<User, 'password'> | null> {
    const { email, password } = data
    const user = await this.userRepo.findByEmail(email)

    if (!user) return null

    const isValidPassword = await comparePassword(password, user.password)
    if (!isValidPassword) return null

    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    return this.userRepo.findAll()
  }

  async findById(id: number): Promise<Omit<User, 'password'> | null> {
    return this.userRepo.findById(id)
  }

  async update(id: number, data: UserUpdate): Promise<Omit<User, 'password'> | null> {
    const payload: UserUpdate = { ...data }

    if (data.password) {
      payload.password = await hashPassword(data.password)
    }

    return this.userRepo.update(id, payload)
  }

  async remove(id: number): Promise<boolean> {
    return this.userRepo.remove(id)
  }
}
