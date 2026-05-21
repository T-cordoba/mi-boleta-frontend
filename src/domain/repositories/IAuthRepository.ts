import { User } from '@/domain/entities/user'

export interface AuthLoginResult {
  token: string
  user: User
}

export interface IAuthRepository {
  login(email: string, password: string): Promise<AuthLoginResult>
  register(name: string, email: string, password: string): Promise<User>
}
