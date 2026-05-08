'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Users, Gem, Wine, MoonStar } from 'lucide-react'

const events = [
  {
    time: '16:00',
    label: 'Сбор гостей',
    icon: <Users className="w-10 h-10" strokeWidth={1.2} />,
  },
  {
    time: '17:00',
    label: 'Церемония регистрации',
    icon: <Gem className="w-10 h-10" strokeWidth={1.2} />,
  },
  {
    time: '17:40',
    label: 'Начало банкета',
    icon: <Wine className="w-10 h-10" strokeWidth={1.2} />,
  },
  {
    time: '23:00',
    label: 'Завершение вечера',
    icon: <MoonStar className="w-10 h-10" strokeWidth={1.2} />,
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
