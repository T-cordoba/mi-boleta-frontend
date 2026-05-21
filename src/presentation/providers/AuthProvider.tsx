'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@/domain/entities/user'
import { authService } from '@/application/services/auth.service'

interface AuthContextValue {
  user: User | null
  setUser: (u: User | null) => void
  logout: () => void
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => authService.getCurrentUser())

  function logout() {
    authService.logout()
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, logout, isAdmin: user?.role === 'admin' }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider')
  return ctx
}
