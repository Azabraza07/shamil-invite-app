import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, attending, companion_name, drink_preferences } = body

    if (!name || typeof attending !== 'boolean') {
      return NextResponse.json({ error: 'Заполните обязательные поля' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('guests')
      .insert({
        name,
        attending,
        companion_name: companion_name || null,
        drink_preferences: drink_preferences || [],
      })
      .select('id')
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Ошибка сохранения' }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data.id })
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, attending, companion_name, drink_preferences } = body

    if (!id || !name || typeof attending !== 'boolean') {
      return NextResponse.json({ error: 'Заполните обязательные поля' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('guests')
      .update({
        name,
        attending,
        companion_name: companion_name || null,
        drink_preferences: drink_preferences || [],
      })
      .eq('id', id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Ошибка обновления' }, { status: 500 })
    }

    return NextResponse.json({ success: true, id })
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
