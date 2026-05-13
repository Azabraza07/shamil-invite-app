import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ── Верификация admin session токена через Web Crypto (Edge runtime) ──
async function verifyAdminSession(cookieValue: string | undefined): Promise<boolean> {
  if (!cookieValue) return false
  const parts = cookieValue.split('.')
  if (parts.length !== 2) return false
  const [token, sig] = parts
  if (token.length !== 64 || sig.length !== 64) return false

  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) return false

  try {
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const sigBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(token))
    const expectedSig = Array.from(new Uint8Array(sigBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')

    // Timing-safe сравнение
    if (sig.length !== expectedSig.length) return false
    let diff = 0
    for (let i = 0; i < sig.length; i++) {
      diff |= sig.charCodeAt(i) ^ expectedSig.charCodeAt(i)
    }
    return diff === 0
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Защита admin роутов ───────────────────────────────────────────
  const isAdminPage = pathname.startsWith('/admin') && pathname !== '/admin-login'
  const isAdminGuestsApi = pathname.startsWith('/api/admin/guests')

  if (isAdminPage || isAdminGuestsApi) {
    const cookieValue = request.cookies.get('admin_session')?.value
    const valid = await verifyAdminSession(cookieValue)

    if (!valid) {
      if (isAdminGuestsApi) {
        return NextResponse.json({ ok: false }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/admin-login', request.url))
    }
  }

  // ── Security headers ──────────────────────────────────────────────
  const response = NextResponse.next()
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  )
  return response
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
}
