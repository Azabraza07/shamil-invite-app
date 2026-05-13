import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminSessionToken } from '@/lib/admin-session'

const ALLOWED_DRINKS = [
  'Шампанское', 'Белое вино', 'Красное вино', 'Виски',
  'Водка', 'Джин', 'Ром', 'Не пью алкоголь',
]

async function checkAdmin() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  return verifyAdminSessionToken(session?.value ?? '')
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const { id } = await params
  const { error } = await supabaseAdmin
    .from('guests')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const { id } = await params

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const { name, attending, companion_name, drink_preferences } = body as Record<string, unknown>

  if (typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ ok: false, error: 'Имя обязательно' }, { status: 400 })
  }
  if (name.trim().length > 100) {
    return NextResponse.json({ ok: false, error: 'Имя слишком длинное' }, { status: 400 })
  }
  if (typeof attending !== 'boolean') {
    return NextResponse.json({ ok: false, error: 'attending обязателен' }, { status: 400 })
  }
  if (companion_name !== null && companion_name !== undefined) {
    if (typeof companion_name !== 'string' || companion_name.length > 100) {
      return NextResponse.json({ ok: false, error: 'Имя спутника слишком длинное' }, { status: 400 })
    }
  }
  if (drink_preferences !== undefined && drink_preferences !== null) {
    if (
      !Array.isArray(drink_preferences) ||
      (drink_preferences as unknown[]).some((d) => !ALLOWED_DRINKS.includes(d as string))
    ) {
      return NextResponse.json({ ok: false, error: 'Недопустимые напитки' }, { status: 400 })
    }
  }

  const { data, error } = await supabaseAdmin
    .from('guests')
    .update({
      name: name.trim(),
      attending,
      companion_name: companion_name ?? null,
      drink_preferences: drink_preferences ?? [],
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, guest: data })
}
