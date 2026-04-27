'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const DRINKS = [
  'Шампанское',
  'Белое вино',
  'Красное вино',
  'Виски',
  'Водка',
  'Джин',
  'Ром',
  'Не пью алкоголь',
]

export default function GuestForm() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const [name, setName] = useState('')
  const [attending, setAttending] = useState<boolean | null>(null)
  const [companion, setCompanion] = useState('')
  const [drinks, setDrinks] = useState<string[]>([])
  const [guestId, setGuestId] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  // Восстанавливаем состояние из localStorage при монтировании
  useEffect(() => {
    if (localStorage.getItem('rsvp_submitted') === 'true') {
      const savedName = localStorage.getItem('rsvp_name') || ''
      const savedAttending = localStorage.getItem('rsvp_attending')
      const savedId = localStorage.getItem('rsvp_id')
      const savedDrinks = localStorage.getItem('rsvp_drinks')
      const savedCompanion = localStorage.getItem('rsvp_companion') || ''
      setName(savedName)
      setCompanion(savedCompanion)
      if (savedAttending !== null) setAttending(savedAttending === 'true')
      if (savedId) setGuestId(savedId)
      if (savedDrinks) setDrinks(JSON.parse(savedDrinks))
      setStatus('success')
    }
  }, [])

  const toggleDrink = (d: string) => {
    setDrinks((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || attending === null) {
      setErrorMsg('Пожалуйста, заполните имя и укажите, придёте ли вы.')
      return
    }
    setErrorMsg('')
    setStatus('loading')

    const payload = {
      name: name.trim(),
      attending,
      companion_name: companion.trim() || null,
      drink_preferences: drinks,
    }

    try {
      const isEdit = !!guestId
      const res = await fetch('/api/rsvp', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEdit ? { id: guestId, ...payload } : payload),
      })

      if (res.ok) {
        const data = await res.json()
        const savedId = data.id ?? guestId
        setGuestId(savedId)
        localStorage.setItem('rsvp_submitted', 'true')
        localStorage.setItem('rsvp_name', name.trim())
        localStorage.setItem('rsvp_attending', String(attending))
        localStorage.setItem('rsvp_id', String(savedId))
        localStorage.setItem('rsvp_drinks', JSON.stringify(drinks))
        localStorage.setItem('rsvp_companion', companion.trim())
        setStatus('success')
      } else {
        const data = await res.json()
        setErrorMsg(data.error || 'Произошла ошибка')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Ошибка соединения')
      setStatus('error')
    }
  }

  return (
    <section id="guest-form" className="py-24 px-4 bg-white" ref={ref}>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-5xl text-center text-charcoal mb-4">
            Анкета гостя
          </h2>
          <p className="text-center text-stone-400 mb-2">
            Пожалуйста, подтвердите своё присутствие до:
          </p>
          <p className="text-center text-charcoal font-semibold text-lg mb-12">
            01 / 06 / 2026
          </p>
        </motion.div>

        {status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16 flex flex-col items-center"
          >
            {attending ? (
              <>
                <div className="font-serif text-5xl mb-6 text-stone-400 select-none">♡</div>
                <h3 className="font-serif text-4xl text-charcoal mb-4">
                  Спасибо, {name.split(' ')[0]}!
                </h3>
                <p className="text-stone-500 text-lg leading-relaxed max-w-sm">
                  Мы очень рады, что вы будете с нами в этот особенный день.
                  До встречи на свадьбе!
                </p>
              </>
            ) : (
              <>
                <div className="font-serif text-5xl mb-6 text-stone-300 select-none">✦</div>
                <h3 className="font-serif text-4xl text-charcoal mb-4">
                  Спасибо, {name.split(' ')[0]}
                </h3>
                <p className="text-stone-500 text-lg leading-relaxed max-w-sm">
                  Жаль, что вас не будет с нами. Спасибо, что сообщили —
                  мы обязательно отметим этот день и будем вспоминать вас.
                </p>
              </>
            )}

            <button
              onClick={() => setStatus('idle')}
              className="mt-10 text-sm text-stone-400 underline underline-offset-4 hover:text-charcoal transition-colors"
            >
              Изменить ответ
            </button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {/* Name */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                Имя и Фамилия *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Введите своё имя"
                className="w-full border-b border-stone-200 py-3 text-charcoal placeholder:text-stone-300 focus:outline-none focus:border-charcoal transition-colors bg-transparent"
              />
            </div>

            {/* Attending */}
            <div>
              <p className="text-xs uppercase tracking-widest text-stone-400 mb-3">
                Планируете ли Вы присутствовать? *
              </p>
              <div className="flex gap-3">
                {[
                  { value: true, label: 'Да, с удовольствием' },
                  { value: false, label: 'Не смогу' },
                ].map((opt) => (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => setAttending(opt.value)}
                    className={`px-6 py-3 border text-sm tracking-wide transition-all duration-200
                      ${attending === opt.value
                        ? 'bg-charcoal text-white border-charcoal'
                        : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400 hover:text-stone-700'
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Companion */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                Имя и Фамилия спутника / спутницы
              </label>
              <input
                type="text"
                value={companion}
                onChange={(e) => setCompanion(e.target.value)}
                placeholder="Если придёте не одни"
                className="w-full border-b border-stone-200 py-3 text-charcoal placeholder:text-stone-300 focus:outline-none focus:border-charcoal transition-colors bg-transparent"
              />
            </div>

            {/* Drinks */}
            <div>
              <p className="text-xs uppercase tracking-widest text-stone-400 mb-4">
                Предпочтения по напиткам
              </p>
              <div className="flex flex-wrap gap-2">
                {DRINKS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDrink(d)}
                    className={`px-4 py-2 border text-sm tracking-wide transition-all duration-200
                      ${drinks.includes(d)
                        ? 'bg-charcoal text-white border-charcoal'
                        : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400 hover:text-stone-700'
                      }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {errorMsg && (
              <p className="text-red-400 text-sm">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-charcoal text-white py-4 text-sm tracking-widest uppercase hover:bg-stone-700 transition-colors disabled:opacity-50"
            >
              {status === 'loading'
                ? 'Отправляем...'
                : guestId
                ? 'Сохранить изменения'
                : 'Подтвердить'}
            </button>
          </motion.form>
        )}
      </div>
    </section>
  )
}
