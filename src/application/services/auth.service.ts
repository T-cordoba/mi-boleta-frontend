import Cookies from 'js-cookie'
import { authRepository } from '@/infrastructure/repositories/auth.repository'
import { User } from '@/domain/entities/user'

const COOKIE_OPTS = { expires: 1, sameSite: 'strict' as const }

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const res = await authRepository.login(email, password)
    const { token, user } = res.data
    Cookies.set('token', token, COOKIE_OPTS)
    Cookies.set('user', JSON.stringify(user), COOKIE_OPTS)
    return user
  },

  async register(name: string, email: string, password: string): Promise<User> {
    const res = await authRepository.register(name, email, password)
    return res.data
  },

  logout(): void {
    Cookies.remove('token')
    Cookies.remove('user')
  },

  getCurrentUser(): User | null {
    try {
      const raw = Cookies.get('user')
      return raw ? (JSON.parse(raw) as User) : null
    } catch {
      return null
    }
  },

  isAuthenticated(): boolean {
    return !!Cookies.get('token')
  },
}
