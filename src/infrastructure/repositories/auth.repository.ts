import { api } from '@/infrastructure/api/client'
import { User } from '@/domain/entities/user'
import { IAuthRepository, AuthLoginResult } from '@/domain/repositories/IAuthRepository'

interface LoginResponse {
  data: { token: string; user: User }
}

interface RegisterResponse {
  data: User
}

export const authRepository: IAuthRepository = {
  async login(email: string, password: string): Promise<AuthLoginResult> {
    const res = await api.post<LoginResponse>('/auth/login', { email, password }, { skipAuth: true })
    return res.data
  },

  async register(name: string, email: string, password: string): Promise<User> {
    const res = await api.post<RegisterResponse>(
      '/auth/register',
      { name, email, password },
      { skipAuth: true },
    )
    return res.data
  },
}
