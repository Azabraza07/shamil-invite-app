'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const DAYS = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС']
// June 2026: starts on Monday (day 1)
const JUNE_2026 = [
  [1, 2, 3, 4, 5, 6, 7],
  [8, 9, 10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19, 20, 21],
  [22, 23, 24, 25, 26, 27, 28],
  [29, 30, null, null, null, null, null],
]

export default function DateSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-24 px-4 bg-stone-50">
      <div className="max-w-5xl mx-auto" ref={ref}>
        <div className="flex flex-col md:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="flex-1"
          >
            <h2 className="font-serif text-5xl md:text-6xl text-charcoal mb-4">
              Мы ждём вас
            </h2>
            <p className="text-stone-500 text-lg">
              Не пропустите важное событие лета&nbsp;— день нашей свадьбы!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="border border-stone-200 bg-white p-8 rounded-sm shadow-sm min-w-[300px]"
          >
            <p className="font-serif text-center text-2xl text-charcoal mb-2">Июнь</p>
            <p className="text-center text-stone-400 tracking-widest text-sm mb-1">
              26 / 06 / 26
            </p>
            <div className="divider my-4 text-stone-200">
              <span className="text-stone-300">◇</span>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {DAYS.map((d) => (
                <div key={d} className="text-stone-400 font-medium pb-1">
                  {d}
                </div>
              ))}
              {JUNE_2026.map((week, wi) =>
                week.map((day, di) => (
                  <div
                    key={`${wi}-${di}`}
                    className={`
                      py-1 rounded-sm
                      ${day === 26 ? 'bg-charcoal text-white font-semibold' : 'text-stone-600'}
                      ${!day ? 'invisible' : ''}
                    `}
                  >
                    {day}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
