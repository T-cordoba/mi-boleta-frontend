import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const userRaw = request.cookies.get('user')?.value
  const { pathname } = request.nextUrl

  const isAuthenticated = !!token
  const isAuthPage = pathname === '/login' || pathname === '/register'
  const isLanding = pathname === '/'
  const isAdminPage = pathname.startsWith('/admin')

  if (isAuthenticated && isLanding) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!isAuthenticated && !isAuthPage && !isLanding) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (isAuthenticated && isAdminPage) {
    try {
      const user = userRaw ? JSON.parse(userRaw) : null
      if (user?.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } catch {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|_next).*)'],
}
