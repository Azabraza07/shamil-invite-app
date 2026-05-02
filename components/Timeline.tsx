'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const events = [
  {
    time: '16:00',
    label: 'Сбор гостей',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-10 h-10">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
        <circle cx="12" cy="9" r="2.5" />
        <path d="M8 20s1-1 4-1 4 1 4 1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    time: '17:00',
    label: 'Церемония регистрации',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-10 h-10">
        <circle cx="8" cy="12" r="5.5" />
        <circle cx="16" cy="12" r="5.5" />
      </svg>
    ),
  },
  {
    time: '17:40',
    label: 'Начало банкета',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-10 h-10">
        <path d="M8 3v4a4 4 0 0 0 8 0V3" />
        <path d="M12 7v14M8 21h8" />
        <path d="M6 3h3M15 3h3" />
        <circle cx="8" cy="1.5" r="0.8" fill="currentColor" />
        <circle cx="12" cy="1" r="0.8" fill="currentColor" />
        <circle cx="16" cy="1.5" r="0.8" fill="currentColor" />
      </svg>
    ),
  },
  {
    time: '23:00',
    label: 'Завершение вечера',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-10 h-10">
        <path d="M12 2C6 2 6 8 6 8s0 2 3 3v9a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-9c3-1 3-3 3-3s0-6-6-6z" />
        <path d="M9 13h6" />
        <circle cx="7" cy="6" r="1" fill="currentColor" />
        <circle cx="17" cy="6" r="1" fill="currentColor" />
      </svg>
    ),
  },
]

export default function Timeline() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-24 px-4 bg-stone-50" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-serif text-5xl text-center text-charcoal mb-16"
        >
          Тайминг
        </motion.h2>

        <div className="relative">
          {/* Icons row */}
          <div className="grid grid-cols-4 gap-4 mb-0">
            {events.map((e, i) => (
              <motion.div
                key={e.time}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="text-stone-400 mb-4">{e.icon}</div>
              </motion.div>
            ))}
          </div>

          {/* Timeline line — анимированная */}
          <div className="relative flex items-center mb-6">
            <motion.div
              className="flex-1 h-px bg-stone-200 origin-left"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            />
            <motion.div
              className="mx-3 text-stone-300"
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.7 }}
            >◇</motion.div>
            <motion.div
              className="flex-1 h-px bg-stone-200 origin-right"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            />
          </div>

          {/* Time & labels */}
          <div className="grid grid-cols-4 gap-4">
            {events.map((e, i) => (
              <motion.div
                key={e.time}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="text-center"
              >
                <p className="font-semibold text-charcoal text-lg mb-1">{e.time}</p>
                <p className="text-stone-500 text-sm leading-tight">{e.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
