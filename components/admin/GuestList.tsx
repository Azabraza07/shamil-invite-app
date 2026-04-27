'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import type { Guest } from '@/lib/supabase-admin'

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

type Filter = 'all' | 'yes' | 'no'

// Анимированный счётчик
function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = 0
    const duration = 800
    const step = 16
    const increment = value / (duration / step)
    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setDisplay(value)
        clearInterval(timer)
      } else {
        setDisplay(Math.floor(start))
      }
    }, step)
    return () => clearInterval(timer)
  }, [value])
  return <>{display}</>
}

// Прогресс-бар посещаемости
function AttendanceBar({ attending, total }: { attending: number; total: number }) {
  const [width, setWidth] = useState(0)
  const pct = total > 0 ? Math.round((attending / total) * 100) : 0
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 200)
    return () => clearTimeout(t)
  }, [pct])
  return (
    <div className="relative">
      <div className="flex justify-between items-end mb-2">
        <span className="text-xs text-white/30 uppercase tracking-widest">Посещаемость</span>
        <span className="text-3xl font-light text-amber-300">{pct}%</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${width}%`,
            background: 'linear-gradient(90deg, #D4A853, #F0C060)',
          }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-xs text-white/20">{attending} придут</span>
        <span className="text-xs text-white/20">{total - attending} не придут</span>
      </div>
    </div>
  )
}

export default function GuestList({ guests }: { guests: Guest[] }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const searchRef = useRef<HTMLInputElement>(null)

  const total = guests.length
  const attending = guests.filter((g) => g.attending).length
  const notAttending = total - attending

  const filtered = useMemo(() => {
    return guests.filter((g) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'yes' && g.attending) ||
        (filter === 'no' && !g.attending)
      const q = search.toLowerCase()
      const matchesSearch =
        !q ||
        g.name.toLowerCase().includes(q) ||
        (g.companion_name?.toLowerCase().includes(q) ?? false)
      return matchesFilter && matchesSearch
    })
  }, [guests, search, filter])

  const drinkStats = useMemo(() => {
    const counts: Record<string, number> = {}
    guests
      .filter((g) => g.attending)
      .forEach((g) =>
        g.drink_preferences.forEach((d) => {
          counts[d] = (counts[d] || 0) + 1
        })
      )
    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [guests])

  const maxDrink = drinkStats[0]?.[1] ?? 1

  return (
    <div className="min-h-screen" style={{ background: '#0c0c0c' }}>

      {/* ─── Шапка ─── */}
      <div
        className="sticky top-0 z-20 px-4 py-3 border-b"
        style={{ background: 'rgba(12,12,12,0.85)', backdropFilter: 'blur(16px)', borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-amber-300/60 text-lg">✦</span>
            <span className="text-white/80 font-light tracking-widest text-sm uppercase">
              Шамиль & Милана
            </span>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="px-3 py-1.5 text-xs text-white/30 border rounded-lg transition-all hover:text-white/60 hover:border-white/20"
              style={{ borderColor: 'rgba(255,255,255,0.1)' }}
            >
              Выйти
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">

        {/* ─── Большие цифры ─── */}
        <div className="grid grid-cols-3 gap-3">
          {/* Всего */}
          <div
            className="rounded-2xl p-4 border text-center"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}
          >
            <div className="text-4xl font-light text-white/90 tabular-nums">
              <AnimatedNumber value={total} />
            </div>
            <div className="text-xs text-white/25 uppercase tracking-widest mt-1">Всего</div>
          </div>
          {/* Придут */}
          <div
            className="rounded-2xl p-4 border text-center relative overflow-hidden"
            style={{ background: 'rgba(52,211,153,0.05)', borderColor: 'rgba(52,211,153,0.15)' }}
          >
            <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(circle at 50% 0%, #34D399, transparent 70%)' }} />
            <div className="text-4xl font-light text-emerald-400 tabular-nums relative">
              <AnimatedNumber value={attending} />
            </div>
            <div className="text-xs text-emerald-400/40 uppercase tracking-widest mt-1 relative">Придут</div>
          </div>
          {/* Не придут */}
          <div
            className="rounded-2xl p-4 border text-center relative overflow-hidden"
            style={{ background: 'rgba(251,113,133,0.05)', borderColor: 'rgba(251,113,133,0.15)' }}
          >
            <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(circle at 50% 0%, #FB7185, transparent 70%)' }} />
            <div className="text-4xl font-light text-rose-400 tabular-nums relative">
              <AnimatedNumber value={notAttending} />
            </div>
            <div className="text-xs text-rose-400/40 uppercase tracking-widest mt-1 relative">Нет</div>
          </div>
        </div>

        {/* ─── Прогресс-бар ─── */}
        {total > 0 && (
          <div
            className="rounded-2xl px-5 py-4 border"
            style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}
          >
            <AttendanceBar attending={attending} total={total} />
          </div>
        )}

        {/* ─── Напитки ─── */}
        {drinkStats.length > 0 && (
          <div
            className="rounded-2xl px-5 py-4 border"
            style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}
          >
            <p className="text-xs text-white/20 uppercase tracking-widest mb-4">Напитки</p>
            <div className="space-y-2.5">
              {drinkStats.map(([drink, count]) => (
                <div key={drink} className="flex items-center gap-3">
                  <span className="text-xs text-white/40 w-28 shrink-0 truncate">{drink}</span>
                  <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <DrinkBar count={count} max={maxDrink} />
                  </div>
                  <span className="text-xs text-amber-300/60 w-4 text-right shrink-0">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── Поиск + фильтр ─── */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 text-sm">⌕</span>
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по имени..."
              className="w-full pl-8 pr-4 py-2.5 text-sm text-white/70 rounded-xl border placeholder:text-white/15 focus:outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.04)',
                borderColor: search ? 'rgba(212,168,83,0.4)' : 'rgba(255,255,255,0.07)',
              }}
            />
          </div>
          <div
            className="flex rounded-xl border overflow-hidden shrink-0"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}
          >
            {(['all', 'yes', 'no'] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3.5 py-2 text-xs transition-all"
                style={{
                  background: filter === f ? 'rgba(212,168,83,0.15)' : 'rgba(255,255,255,0.02)',
                  color: filter === f ? '#D4A853' : 'rgba(255,255,255,0.25)',
                  borderRight: f !== 'no' ? '1px solid rgba(255,255,255,0.07)' : undefined,
                }}
              >
                {f === 'all' ? 'Все' : f === 'yes' ? '✓' : '✗'}
              </button>
            ))}
          </div>
        </div>

        {(search || filter !== 'all') && (
          <p className="text-xs text-white/20 -mt-1">
            Показано {filtered.length} из {total}
          </p>
        )}

        {/* ─── Список ─── */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3 opacity-20">✦</div>
            <p className="text-white/20 text-sm">Ничего не найдено</p>
          </div>
        ) : (
          <>
            {/* Мобильные карточки */}
            <div className="md:hidden space-y-2">
              {filtered.map((guest) => (
                <div
                  key={guest.id}
                  className="rounded-xl px-4 py-3 border transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.025)',
                    borderColor: guest.attending ? 'rgba(52,211,153,0.12)' : 'rgba(255,255,255,0.06)',
                    borderLeft: guest.attending ? '2px solid rgba(52,211,153,0.4)' : '2px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-white/80 text-sm font-medium leading-snug">{guest.name}</span>
                    <span className={`text-xs font-medium shrink-0 ${guest.attending ? 'text-emerald-400' : 'text-rose-400/70'}`}>
                      {guest.attending ? '✓' : '✗'}
                    </span>
                  </div>
                  {guest.companion_name && (
                    <p className="mt-0.5 text-xs text-white/25">+ {guest.companion_name}</p>
                  )}
                  {guest.drink_preferences.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {guest.drink_preferences.map((d) => (
                        <span
                          key={d}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(212,168,83,0.08)', color: 'rgba(212,168,83,0.5)' }}
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="mt-2 text-xs text-white/15">{formatDate(guest.created_at)}</p>
                </div>
              ))}
            </div>

            {/* Desktop таблица */}
            <div
              className="hidden md:block rounded-2xl border overflow-hidden"
              style={{ borderColor: 'rgba(255,255,255,0.07)' }}
            >
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                    {['#', 'Имя', 'Статус', 'Спутник', 'Напитки', 'Дата'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-widest font-normal" style={{ color: 'rgba(255,255,255,0.2)' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((guest, i) => (
                    <tr
                      key={guest.id}
                      className="transition-colors group"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td className="px-4 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.15)' }}>{i + 1}</td>
                      <td className="px-4 py-3 font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>{guest.name}</td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{
                            background: guest.attending ? 'rgba(52,211,153,0.1)' : 'rgba(251,113,133,0.1)',
                            color: guest.attending ? '#34D399' : '#FB7185',
                          }}
                        >
                          {guest.attending ? '✓ Придёт' : '✗ Нет'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        {guest.companion_name || <span style={{ color: 'rgba(255,255,255,0.1)' }}>—</span>}
                      </td>
                      <td className="px-4 py-3">
                        {guest.drink_preferences.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {guest.drink_preferences.map((d) => (
                              <span
                                key={d}
                                className="text-xs px-2 py-0.5 rounded-full"
                                style={{ background: 'rgba(212,168,83,0.08)', color: 'rgba(212,168,83,0.45)' }}
                              >
                                {d}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span style={{ color: 'rgba(255,255,255,0.1)' }}>—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.2)' }}>
                        {formatDate(guest.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Анимированная полоска напитка
function DrinkBar({ count, max }: { count: number; max: number }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth((count / max) * 100), 300)
    return () => clearTimeout(t)
  }, [count, max])
  return (
    <div
      className="h-full rounded-full transition-all duration-700 ease-out"
      style={{
        width: `${width}%`,
        background: 'linear-gradient(90deg, rgba(212,168,83,0.4), rgba(212,168,83,0.7))',
      }}
    />
  )
}
