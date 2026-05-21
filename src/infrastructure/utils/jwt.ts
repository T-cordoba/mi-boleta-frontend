import { UserRole } from '@/domain/entities/user'

export interface JwtPayload {
  role: UserRole
  sub?: string
  exp?: number
  iat?: number
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const segment = token.split('.')[1]
    if (!segment) return null
    const json = atob(segment.replace(/-/g, '+').replace(/_/g, '/'))
    const payload = JSON.parse(json)
    const role: UserRole = payload?.role === 'admin' ? 'admin' : 'user'
    return { ...payload, role }
  } catch {
    return null
  }
}
