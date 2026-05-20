# MiBoleta — Frontend

Aplicación web para registrar y organizar boletas de rifas, loterías y sorteos. Nunca más pierdas rastro de un número ganador.

## Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Recharts** — gráficos de dashboard
- **React Toastify** — notificaciones
- **Lucide React** — íconos
- **js-cookie** — manejo de token JWT

## Arquitectura

```
src/
├── app/                        # Rutas Next.js
│   ├── (auth)/                 # login, register (público)
│   ├── (protected)/            # dashboard, tickets, admin (requiere auth)
│   ├── layout.tsx              # Root layout con AuthProvider y Toast
│   └── page.tsx                # Landing page
├── domain/
│   └── entities/               # Ticket, User
├── infrastructure/
│   ├── api/client.ts           # Axios con interceptor JWT
│   └── repositories/           # auth.repository, ticket.repository
├── application/
│   ├── services/               # auth.service, ticket.service
│   └── hooks/                  # useDashboard, useTickets, useAdmin
├── presentation/
│   ├── components/
│   │   ├── ui/                 # Primitivos: Button, Input, Modal, Badge…
│   │   ├── layout/             # AppLayout, Navbar
│   │   ├── dashboard/          # StatsCard, GameTypeChart, StatusChart
│   │   └── tickets/            # TicketTable, TicketForm, TicketFilters…
│   └── providers/
│       └── AuthProvider.tsx
└── middleware.ts               # Protección de rutas
```

## Configuración

```bash
cp .env.example .env.local
```

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL base del backend (sin slash final) |

## Desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando | Acción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servir build de producción |
| `npm run lint` | Lint con ESLint |

## Backend

API REST en [`mi-boleta-api`](https://github.com/saurmo/mi-boleta-api). Autenticación por JWT almacenado en cookie.
