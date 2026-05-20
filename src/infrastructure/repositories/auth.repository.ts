import { api } from '@/infrastructure/api/client'
import { User } from '@/domain/entities/user'

interface LoginResponse {
  data: { token: string; user: User }
}

interface RegisterResponse {
  data: User
}

export const authRepository = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { email, password }, { skipAuth: true }),

  register: (name: string, email: string, password: string) =>
    api.post<RegisterResponse>('/auth/register', { name, email, password }, { skipAuth: true }),
}
