import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyAdminSessionToken } from '@/lib/admin-session'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')

  if (!verifyAdminSessionToken(session?.value ?? '')) {
    redirect('/admin-login')
  }

  return <>{children}</>
}
