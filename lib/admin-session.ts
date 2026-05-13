import { createHmac, randomBytes, timingSafeEqual } from 'crypto'

/**
 * Генерирует подписанный session token: `<random64hex>.<hmac64hex>`
 * Cookie хранит этот токен, а не сам ADMIN_SESSION_SECRET.
 */
export function generateAdminSessionToken(): string {
  const token = randomBytes(32).toString('hex')
  const sig = createHmac('sha256', process.env.ADMIN_SESSION_SECRET!)
    .update(token)
    .digest('hex')
  return `${token}.${sig}`
}

/**
 * Проверяет подписанный session token через timing-safe сравнение.
 * Работает в Node.js runtime (API routes, server components).
 */
export function verifyAdminSessionToken(cookieValue: string): boolean {
  const parts = cookieValue?.split('.')
  if (!parts || parts.length !== 2) return false
  const [token, sig] = parts
  if (token.length !== 64 || sig.length !== 64) return false

  try {
    const expectedSig = createHmac('sha256', process.env.ADMIN_SESSION_SECRET!)
      .update(token)
      .digest('hex')
    return timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expectedSig, 'hex'))
  } catch {
    return false
  }
}
