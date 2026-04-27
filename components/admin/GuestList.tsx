'use client'

import { useState, useMemo, useEffect } from 'react'
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

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = 0
    const duration = 800
    const step = 16
    const increment = value / (duration / step)
    const timer = setInterval(() => {
      start += increment
      if (start >= value) { setDisplay(value); clearInterval(timer) }
      else setDisplay(Math.floor(start))
    }, step)
    return () => clearInterval(timer)
  }, [value])
  return <>{display}</>
}

function AttendanceBar({ attending, total }: { attending: number; total: number }) {
  const [width, setWidth] = useState(0)
  const pct = total > 0 ? Math.round((attending / total) * 100) : 0
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 200)
    return () => clearTimeout(t)
  }, [pct])
  return (
    <div>
      <div className="flex justify-between items-end mb-2">
        <span className="text-xs text-stone-400 uppercase tracking-widest">Посещаемость</span>
        <span className="text-2xl font-light text-stone-700">{pct}%</span>
      </div>
      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%`, background: 'linear-gradient(90deg, #a8b5a0, #7a9a70)' }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-xs text-stone-400">{attending} придут</span>
        <span className="text-xs text-stone-400">{total - attending} не придут</span>
      </div>
    </div>
  )
}

function DrinkBar({ count, max }: { count: number; max: number }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth((count / max) * 100), 300)
    return () => clearTimeout(t)
  }, [count, max])
  return (
    <div className="h-full rounded-full transition-all duration-700 ease-out bg-stone-300"
      style={{ width: `${width}%` }} />
  )
}

export default function GuestList({ guests }: { guests: Guest[] }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

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
    guests.filter((g) => g.attending).forEach((g) =>
      g.drink_preferences.forEach((d) => { counts[d] = (counts[d] || 0) + 1 })
    )
    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [guests])

  const maxDrink = drinkStats[0]?.[1] ?? 1

  return (
    <div className="min-h-screen bg-stone-50">

      {/* Шапка */}
      <div className="sticky top-0 z-20 bg-white border-b border-stone-100 px-4 py-3 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-stone-300 text-base">✦</span>
            <span className="text-stone-500 font-light tracking-widest text-sm uppercase">
              Шамиль & Милана
            </span>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="px-3 py-1.5 text-xs text-stone-400 border border-stone-200 rounded-lg hover:bg-stone-50 hover:text-stone-600 transition-colors"
            >
              Выйти
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl border border-stone-100 p-4 text-center shadow-sm">
            <div className="text-4xl font-light text-stone-700 tabular-nums">
              <AnimatedNumber value={total} />
            </div>
            <div className="text-xs text-stone-400 uppercase tracking-widest mt-1">Всего</div>
          </div>
          <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-4 text-center shadow-sm">
            <div className="text-4xl font-light text-emerald-600 tabular-nums">
              <AnimatedNumber value={attending} />
            </div>
            <div className="text-xs text-emerald-400 uppercase tracking-widest mt-1">Придут</div>
          </div>
          <div className="bg-rose-50 rounded-2xl border border-rose-100 p-4 text-center shadow-sm">
            <div className="text-4xl font-light text-rose-400 tabular-nums">
              <AnimatedNumber value={notAttending} />
            </div>
            <div className="text-xs text-rose-300 uppercase tracking-widest mt-1">Нет</div>
          </div>
        </div>

        {/* Прогресс */}
        {total > 0 && (
          <div className="bg-white rounded-2xl border border-stone-100 px-5 py-4 shadow-sm">
            <AttendanceBar attending={attending} total={total} />
          </div>
        )}

        {/* Напитки */}
        {drinkStats.length > 0 && (
          <div className="bg-white rounded-2xl border border-stone-100 px-5 py-4 shadow-sm">
            <p className="text-xs text-stone-400 uppercase tracking-widest mb-4">Напитки</p>
            <div className="space-y-2.5">
              {drinkStats.map(([drink, count]) => (
                <div key={drink} className="flex items-center gap-3">
                  <span className="text-xs text-stone-500 w-28 shrink-0 truncate">{drink}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-stone-100 overflow-hidden">
                    <DrinkBar count={count} max={maxDrink} />
                  </div>
                  <span className="text-xs font-medium text-stone-500 w-4 text-right shrink-0">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Поиск + фильтр */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 text-sm select-none">⌕</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по имени..."
              className="w-full pl-8 pr-4 py-2.5 text-sm text-stone-600 bg-white rounded-xl border border-stone-200 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-200 transition-all"
            />
          </div>
          <div className="flex bg-white border border-stone-200 rounded-xl overflow-hidden shrink-0">
            {(['all', 'yes', 'no'] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-2 text-xs transition-colors border-r border-stone-100 last:border-0 ${
                  filter === f
                    ? 'bg-stone-800 text-white'
                    : 'text-stone-400 hover:bg-stone-50'
                }`}
              >
                {f === 'all' ? 'Все' : f === 'yes' ? '✓' : '✗'}
              </button>
            ))}
          </div>
        </div>

        {(search || filter !== 'all') && (
          <p className="text-xs text-stone-400 -mt-1">
            Показано {filtered.length} из {total}
          </p>
        )}

        {/* Список */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-stone-300 text-sm">Ничего не найдено</p>
          </div>
        ) : (
          <>
            {/* Мобиль */}
            <div className="md:hidden space-y-2">
              {filtered.map((guest) => (
                <div
                  key={guest.id}
                  className={`bg-white rounded-xl border px-4 py-3 shadow-sm ${
                    guest.attending ? 'border-l-2 border-l-emerald-300 border-stone-100' : 'border-stone-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-stone-700 text-sm font-medium">{guest.name}</span>
                    <span className={`text-xs font-medium shrink-0 ${guest.attending ? 'text-emerald-500' : 'text-rose-400'}`}>
                      {guest.attending ? '✓' : '✗'}
                    </span>
                  </div>
                  {guest.companion_name && (
                    <p className="mt-0.5 text-xs text-stone-400">+ {guest.companion_name}</p>
                  )}
                  {guest.drink_preferences.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {guest.drink_preferences.map((d) => (
                        <span key={d} className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">
                          {d}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="mt-2 text-xs text-stone-300">{formatDate(guest.created_at)}</p>
                </div>
              ))}
            </div>

            {/* Desktop */}
            <div className="hidden md:block rounded-2xl border border-stone-100 overflow-hidden shadow-sm">
              <table className="w-full text-sm bg-white">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50">
                    {['#', 'Имя', 'Статус', 'Спутник', 'Напитки', 'Дата'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-wider font-normal text-stone-400">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {filtered.map((guest, i) => (
                    <tr key={guest.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-4 py-3 text-xs text-stone-300">{i + 1}</td>
                      <td className="px-4 py-3 text-stone-700 font-medium">{guest.name}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          guest.attending
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-rose-50 text-rose-400'
                        }`}>
                          {guest.attending ? '✓ Придёт' : '✗ Нет'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-stone-400">
                        {guest.companion_name || <span className="text-stone-200">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        {guest.drink_preferences.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {guest.drink_preferences.map((d) => (
                              <span key={d} className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">
                                {d}
                              </span>
                            ))}
                          </div>
                        ) : <span className="text-stone-200">—</span>}
                      </td>
                      <td className="px-4 py-3 text-xs text-stone-300 whitespace-nowrap">
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
