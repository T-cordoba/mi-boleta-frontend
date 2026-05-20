import { AppLayout } from '@/presentation/components/layout/AppLayout'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>
}
