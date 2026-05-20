import Cookies from 'js-cookie'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!

interface ApiOptions extends RequestInit {
  skipAuth?: boolean
}

async function request<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { skipAuth, ...fetchOptions } = options
  const token = Cookies.get('token')

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  }

  if (!skipAuth && token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...fetchOptions, headers })

  if (res.status === 401) {
    if (!skipAuth) {
      // Token expirado o inválido — limpiar sesión y redirigir
      Cookies.remove('token')
      Cookies.remove('user')
      window.location.href = '/login'
      throw new Error('Tu sesión expiró. Por favor inicia sesión nuevamente.')
    }
    // En endpoints de auth (login) un 401 significa credenciales incorrectas
    const errJson = await res.json().catch(() => ({}))
    const raw: string = errJson?.error ?? ''
    throw new Error(
      raw && !raw.toLowerCase().includes('unauthorized')
        ? raw
        : 'Correo o contraseña incorrectos. Verifica tus datos.',
    )
  }

  if (res.status === 204) return undefined as T

  const json = await res.json()

  if (!res.ok) {
    const raw = json?.error ?? 'Ocurrió un error inesperado'
    throw new Error(parseApiError(raw, res.status))
  }

  return json as T
}

function parseApiError(raw: string, status: number): string {
  if (status === 403) return 'No tienes permisos para realizar esta acción.'
  if (status === 404) return 'El recurso solicitado no fue encontrado.'
  if (status === 409) return 'Ya existe una cuenta con ese correo electrónico.'
  if (status === 500) return 'Error interno del servidor. Intenta de nuevo más tarde.'

  if (raw.startsWith('Datos inválidos:')) {
    const fields = raw.replace('Datos inválidos:', '').trim()
    const messages = fields.split(';').map((f) => {
      const colonIdx = f.indexOf(':')
      return colonIdx !== -1 ? f.slice(colonIdx + 1).trim() : f.trim()
    })
    return messages.join(' · ')
  }

  return raw
}

export const api = {
  get: <T>(path: string, opts?: ApiOptions) =>
    request<T>(path, { ...opts, method: 'GET' }),

  post: <T>(path: string, body: unknown, opts?: ApiOptions) =>
    request<T>(path, { ...opts, method: 'POST', body: JSON.stringify(body) }),

  put: <T>(path: string, body: unknown, opts?: ApiOptions) =>
    request<T>(path, { ...opts, method: 'PUT', body: JSON.stringify(body) }),

  delete: <T>(path: string, opts?: ApiOptions) =>
    request<T>(path, { ...opts, method: 'DELETE' }),
}
