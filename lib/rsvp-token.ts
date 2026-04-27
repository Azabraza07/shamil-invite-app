import { createHmac, timingSafeEqual } from 'crypto'

export function generateRsvpToken(guestId: string): string {
  return createHmac('sha256', process.env.ADMIN_SESSION_SECRET!)
    .update(guestId)
    .digest('hex')
}

export function verifyRsvpToken(guestId: string, token: string): boolean {
  const expected = generateRsvpToken(guestId)
  try {
    return timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(token, 'hex'))
  } catch {
    return false
  }
}
