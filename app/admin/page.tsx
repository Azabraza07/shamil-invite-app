import { supabaseAdmin } from '@/lib/supabase-admin'
import type { Guest } from '@/lib/supabase-admin'
import GuestList from '@/components/admin/GuestList'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const { data, error } = await supabaseAdmin
    .from('guests')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <p className="text-red-500">Ошибка загрузки данных: {error.message}</p>
      </div>
    )
  }

  return <GuestList guests={(data as Guest[]) ?? []} />
}
