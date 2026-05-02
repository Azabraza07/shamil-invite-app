import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { checkRateLimit } from '@/lib/rate-limit'
import { generateRsvpToken, verifyRsvpToken } from '@/lib/rsvp-token'

const ALLOWED_DRINKS = new Set([
  'Шампанское',
  'Белое вино',
  'Красное вино',
  'Виски',
  'Водка',
  'Джин',
  'Ром',
  'Не пью алкоголь',
])

const MAX_NAME_LENGTH = 100
const MAX_COMPANION_LENGTH = 100

function getIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
}

function validateDrinks(drinks: unknown): boolean {
  if (!Array.isArray(drinks)) return false
  if (drinks.length > ALLOWED_DRINKS.size) return false
  return drinks.every((d) => typeof d === 'string' && ALLOWED_DRINKS.has(d))
}

export async function POST(request: NextRequest) {
  try {
    const ip = getIp(request)
    if (!checkRateLimit(`rsvp:${ip}`, 10, 60_000)) {
      return NextResponse.json(
        { error: 'Слишком много запросов. Попробуйте позже.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { name, attending, companion_name, drink_preferences } = body

    if (typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Заполните обязательные поля' }, { status: 400 })
    }
    if (typeof attending !== 'boolean') {
      return NextResponse.json({ error: 'Заполните обязательные поля' }, { status: 400 })
    }
    if (name.trim().length > MAX_NAME_LENGTH) {
      return NextResponse.json({ error: 'Имя слишком длинное' }, { status: 400 })
    }
    if (companion_name !== undefined && companion_name !== null) {
      if (typeof companion_name !== 'string' || companion_name.length > MAX_COMPANION_LENGTH) {
        return NextResponse.json({ error: 'Имя спутника слишком длинное' }, { status: 400 })
      }
    }
    if (drink_preferences !== undefined && !validateDrinks(drink_preferences)) {
      return NextResponse.json({ error: 'Недопустимые напитки' }, { status: 400 })
    }

    // Проверка на дубликат по имени (case-insensitive)
    const { data: existing } = await supabaseAdmin
      .from('guests')
      .select('id')
      .ilike('name', name.trim())
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'Вы уже зарегистрированы. Используйте кнопку «Изменить ответ».' },
        { status: 409 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('guests')
      .insert({
        name: name.trim(),
        attending,
        companion_name: companion_name?.trim() || null,
        drink_preferences: drink_preferences || [],
      })
      .select('id')
      .single()

    if (error) {
      console.error('Supabase error:', error.code)
      return NextResponse.json({ error: 'Ошибка сохранения' }, { status: 500 })
    }

    const token = generateRsvpToken(data.id)
    const response = NextResponse.json({ success: true, id: data.id })
    response.cookies.set('rsvp_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/rsvp',
      maxAge: 60 * 60 * 24 * 90, // 90 дней
    })
    return response
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const ip = getIp(request)
    if (!checkRateLimit(`rsvp:${ip}`, 10, 60_000)) {
      return NextResponse.json(
        { error: 'Слишком много запросов. Попробуйте позже.' },
        { status: 429 }
      )
    }

    // Проверка cookie-токена
    const rsvpToken = request.cookies.get('rsvp_token')?.value
    if (!rsvpToken) {
      return NextResponse.json({ error: 'Нет прав для изменения' }, { status: 403 })
    }

    const body = await request.json()
    const { id, name, companion_name, drink_preferences } = body
    const attending =
      typeof body.attending === 'string' ? body.attending === 'true' : body.attending

    if (!id || typeof id !== 'string' || typeof name !== 'string' || !name.trim() || typeof attending !== 'boolean') {
      return NextResponse.json({ error: 'Заполните обязательные поля' }, { status: 400 })
    }
    if (name.trim().length > MAX_NAME_LENGTH) {
      return NextResponse.json({ error: 'Имя слишком длинное' }, { status: 400 })
    }
    if (companion_name !== undefined && companion_name !== null) {
      if (typeof companion_name !== 'string' || companion_name.length > MAX_COMPANION_LENGTH) {
        return NextResponse.json({ error: 'Имя спутника слишком длинное' }, { status: 400 })
      }
    }
    if (drink_preferences !== undefined && !validateDrinks(drink_preferences)) {
      return NextResponse.json({ error: 'Недопустимые напитки' }, { status: 400 })
    }

    // Верификация: токен должен соответствовать именно этому id
    if (!verifyRsvpToken(id, rsvpToken)) {
      return NextResponse.json({ error: 'Нет прав для изменения' }, { status: 403 })
    }

    const { error } = await supabaseAdmin
      .from('guests')
      .update({
        name: name.trim(),
        attending,
        companion_name: companion_name?.trim() || null,
        drink_preferences: drink_preferences || [],
      })
      .eq('id', id)

    if (error) {
      console.error('Supabase PATCH error:', error.code)
      return NextResponse.json({ error: 'Ошибка обновления' }, { status: 500 })
    }

    return NextResponse.json({ success: true, id })
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
