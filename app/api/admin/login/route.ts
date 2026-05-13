import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { generateAdminSessionToken } from '@/lib/admin-session'

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'

    if (!checkRateLimit(`admin-login:${ip}`, 5, 15 * 60_000)) {
      return NextResponse.json(
        { ok: false, error: 'Слишком много попыток. Попробуйте через 15 минут.' },
        { status: 429 }
      )
    }

    const { password } = await request.json()

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ ok: false }, { status: 401 })
    }

    const response = NextResponse.json({ ok: true })
    response.cookies.set('admin_session', generateAdminSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 дней
    })

    return response
  } catch {
    return NextResponse.json({ ok: false, error: 'Ошибка сервера' }, { status: 500 })
  }
}
