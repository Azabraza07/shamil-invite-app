import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminSessionToken } from '@/lib/admin-session'

export async function GET() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  if (!verifyAdminSessionToken(session?.value ?? '')) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from('guests')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, guests: data })
}
