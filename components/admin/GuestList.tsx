'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import type { Guest } from '@/lib/supabase-admin'

const PAGE_SIZE = 20

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

type Filter = 'all' | 'yes' | 'no'
type SortKey = 'name' | 'attending' | 'created_at'
type SortDir = 'asc' | 'desc'
type Toast = { id: number; msg: string; type: 'success' | 'error' }

// ─── Анимированное число ────────────────────────────────────────────
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

// ─── Progress bar ───────────────────────────────────────────────────
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

// ─── Иконки ─────────────────────────────────────────────────────────
function IconPencil() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  )
}
function IconTrash() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  )
}
function IconRefresh({ spinning }: { spinning: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={spinning ? 'animate-spin' : ''}>
      <polyline points="23 4 23 10 17 10"/>
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
    </svg>
  )
}
// ─── Модальное окно редактирования ──────────────────────────────────
function EditModal({
  guest,
  onClose,
  onSave,
}: {
  guest: Guest
  onClose: () => void
  onSave: (updated: Guest) => void
}) {
  const [name, setName] = useState(guest.name)
  const [attending, setAttending] = useState(guest.attending)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  async function handleSave() {
    if (!name.trim()) { setErr('Имя обязательно'); return }
    setSaving(true)
    setErr('')
    try {
      const res = await fetch(`/api/admin/guests/${guest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          attending,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setErr(data.error || 'Ошибка сохранения'); return }
      onSave(data.guest as Guest)
    } catch {
      setErr('Ошибка соединения')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
        <h2 className="text-lg font-light text-stone-700">Редактировать гостя</h2>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-stone-400 uppercase tracking-wider mb-1 block">Имя</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
            />
          </div>

          <div>
            <label className="text-xs text-stone-400 uppercase tracking-wider mb-1 block">Статус</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAttending(true)}
                className={`flex-1 py-2 rounded-lg text-sm border transition-colors ${attending ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'border-stone-200 text-stone-400'}`}
              >
                ✓ Придёт
              </button>
              <button
                type="button"
                onClick={() => setAttending(false)}
                className={`flex-1 py-2 rounded-lg text-sm border transition-colors ${!attending ? 'bg-rose-50 border-rose-300 text-rose-500' : 'border-stone-200 text-stone-400'}`}
              >
                ✗ Не придёт
              </button>
            </div>
          </div>

        </div>

        {err && <p className="text-red-500 text-sm">{err}</p>}

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 border border-stone-200 rounded-lg text-stone-500 text-sm hover:bg-stone-50 transition-colors"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 bg-stone-700 text-white rounded-lg text-sm hover:bg-stone-800 transition-colors disabled:opacity-50"
          >
            {saving ? 'Сохраняю...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Главный компонент ───────────────────────────────────────────────
export default function GuestList({ guests: initialGuests }: { guests: Guest[] }) {
  const [guestList, setGuestList] = useState<Guest[]>(initialGuests)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: 'created_at', dir: 'desc' })
  const [page, setPage] = useState(1)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const total = guestList.length
  const attending = guestList.filter((g) => g.attending).length
  const notAttending = total - attending

  // ── Toast helper ─────────────────────────────────────────────────
  function addToast(msg: string, type: Toast['type']) {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, msg, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500)
  }

  // ── Refresh ───────────────────────────────────────────────────────
  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      const res = await fetch('/api/admin/guests')
      const data = await res.json()
      if (res.ok) {
        setGuestList(data.guests)
        addToast('Список обновлён', 'success')
      } else {
        addToast('Ошибка обновления', 'error')
      }
    } catch {
      addToast('Ошибка соединения', 'error')
    } finally {
      setRefreshing(false)
    }
  }, [])

  // ── Delete ────────────────────────────────────────────────────────
  async function handleDelete(id: string) {
    if (!confirm('Удалить гостя? Это действие нельзя отменить.')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/guests/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setGuestList((prev) => prev.filter((g) => g.id !== id))
        addToast('Гость удалён', 'success')
      } else {
        addToast('Ошибка удаления', 'error')
      }
    } catch {
      addToast('Ошибка соединения', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  // ── Edit save ─────────────────────────────────────────────────────
  function handleSaveEdit(updated: Guest) {
    setGuestList((prev) => prev.map((g) => (g.id === updated.id ? updated : g)))
    setEditingGuest(null)
    addToast('Изменения сохранены', 'success')
  }

  // ── Sort toggle ───────────────────────────────────────────────────
  function handleSort(key: SortKey) {
    setSort((prev) => ({
      key,
      dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc',
    }))
    setPage(1)
  }

  // ── Filtered + sorted + paginated ────────────────────────────────
  const processed = useMemo(() => {
    let list = guestList.filter((g) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'yes' && g.attending) ||
        (filter === 'no' && !g.attending)
      const q = search.toLowerCase()
      const matchesSearch =
        !q ||
        g.name.toLowerCase().includes(q)
      return matchesFilter && matchesSearch
    })

    list = [...list].sort((a, b) => {
      let cmp = 0
      if (sort.key === 'name') cmp = a.name.localeCompare(b.name, 'ru')
      else if (sort.key === 'attending') cmp = Number(a.attending) - Number(b.attending)
      else cmp = a.created_at.localeCompare(b.created_at)
      return sort.dir === 'asc' ? cmp : -cmp
    })

    return list
  }, [guestList, search, filter, sort])

  const totalPages = Math.max(1, Math.ceil(processed.length / PAGE_SIZE))
  const paginated = processed.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Сбросить страницу при изменении фильтров
  useEffect(() => { setPage(1) }, [search, filter])

  // ── Sort arrow ────────────────────────────────────────────────────
  function SortArrow({ col }: { col: SortKey }) {
    if (sort.key !== col) return <span className="text-stone-200 ml-1">↕</span>
    return <span className="ml-1">{sort.dir === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <div className="min-h-screen bg-stone-50">

      {/* Шапка */}
      <div className="sticky top-0 z-20 bg-white border-b border-stone-100 px-4 py-3 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-stone-300 text-base">✦</span>
            <span className="text-stone-500 font-light tracking-widest text-sm uppercase">
              Шамиль & Милана
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-400 border border-stone-200 rounded-lg hover:bg-stone-50 hover:text-stone-600 transition-colors disabled:opacity-50"
            >
              <IconRefresh spinning={refreshing} /> Обновить
            </button>
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
            Показано {processed.length} из {total}
          </p>
        )}

        {/* Список */}
        {paginated.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-stone-300 text-sm">Ничего не найдено</p>
          </div>
        ) : (
          <>
            {/* Мобиль */}
            <div className="md:hidden space-y-2">
              {paginated.map((guest) => (
                <div
                  key={guest.id}
                  className={`bg-white rounded-xl border px-4 py-3 shadow-sm ${
                    guest.attending ? 'border-l-2 border-l-emerald-300 border-stone-100' : 'border-stone-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-stone-700 text-sm font-medium">{guest.name}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`text-xs font-medium ${guest.attending ? 'text-emerald-500' : 'text-rose-400'}`}>
                        {guest.attending ? '✓' : '✗'}
                      </span>
                      <button
                        onClick={() => setEditingGuest(guest)}
                        className="text-stone-300 hover:text-stone-500 transition-colors p-1"
                      >
                        <IconPencil />
                      </button>
                      <button
                        onClick={() => handleDelete(guest.id)}
                        disabled={deletingId === guest.id}
                        className="text-stone-300 hover:text-rose-400 transition-colors p-1 disabled:opacity-40"
                      >
                        <IconTrash />
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-stone-300">{formatDate(guest.created_at)}</p>
                </div>
              ))}
            </div>

            {/* Desktop */}
            <div className="hidden md:block rounded-2xl border border-stone-100 overflow-hidden shadow-sm">
              <table className="w-full text-sm bg-white">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50">
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wider font-normal text-stone-400">#</th>
                    {([
                      { key: 'name' as SortKey, label: 'Имя' },
                      { key: 'attending' as SortKey, label: 'Статус' },
                    ]).map(({ key, label }) => (
                      <th
                        key={key}
                        onClick={() => handleSort(key)}
                        className="px-4 py-3 text-left text-xs uppercase tracking-wider font-normal text-stone-400 cursor-pointer hover:text-stone-600 select-none"
                      >
                        {label}<SortArrow col={key} />
                      </th>
                    ))}
                    <th
                      onClick={() => handleSort('created_at')}
                      className="px-4 py-3 text-left text-xs uppercase tracking-wider font-normal text-stone-400 cursor-pointer hover:text-stone-600 select-none"
                    >
                      Дата<SortArrow col="created_at" />
                    </th>
                    <th className="px-4 py-3 w-16" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {paginated.map((guest, i) => (
                    <tr key={guest.id} className="hover:bg-stone-50 transition-colors group">
                      <td className="px-4 py-3 text-xs text-stone-300">{(page - 1) * PAGE_SIZE + i + 1}</td>
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
                      <td className="px-4 py-3 text-xs text-stone-300 whitespace-nowrap">
                        {formatDate(guest.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditingGuest(guest)}
                            className="p-1.5 text-stone-300 hover:text-stone-600 transition-colors rounded"
                            title="Редактировать"
                          >
                            <IconPencil />
                          </button>
                          <button
                            onClick={() => handleDelete(guest.id)}
                            disabled={deletingId === guest.id}
                            className="p-1.5 text-stone-300 hover:text-rose-400 transition-colors rounded disabled:opacity-40"
                            title="Удалить"
                          >
                            <IconTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Пагинация */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm text-stone-500 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors disabled:opacity-30"
                >
                  ← Назад
                </button>
                <span className="text-xs text-stone-400">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 text-sm text-stone-500 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors disabled:opacity-30"
                >
                  Вперёд →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Модальное окно редактирования */}
      {editingGuest && (
        <EditModal
          guest={editingGuest}
          onClose={() => setEditingGuest(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* Toast уведомления */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
              t.type === 'success'
                ? 'bg-stone-800 text-white'
                : 'bg-rose-500 text-white'
            }`}
          >
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  )
}
