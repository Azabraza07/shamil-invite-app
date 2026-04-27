'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const WEDDING_DATE = new Date('2026-06-26T16:00:00+03:00')

function pad(n: number) {
  return String(Math.max(0, n)).padStart(2, '0')
}

function getTimeLeft() {
  const diff = WEDDING_DATE.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  return { days, hours, minutes, seconds }
}

export default function Countdown() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    setTime(getTimeLeft())
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  const units = [
    { value: time.days, label: 'Дней' },
    { value: time.hours, label: 'Часов' },
    { value: time.minutes, label: 'Минут' },
    { value: time.seconds, label: 'Секунд' },
  ]

  return (
    <section className="py-24 px-4 bg-charcoal" ref={ref}>
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-serif text-4xl md:text-5xl text-white mb-4"
        >
          До нашей свадьбы осталось
        </motion.h2>

        <div className="divider my-8 text-stone-600">
          <span className="text-stone-500">◇</span>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center items-end gap-3 md:gap-6"
        >
          {units.map((u, i) => (
            <div key={u.label} className="flex items-end gap-3 md:gap-6">
              <div className="text-center">
                <div className="font-serif text-5xl md:text-7xl text-white tracking-tight tabular-nums">
                  {pad(u.value)}
                </div>
                <div className="text-stone-400 text-xs md:text-sm tracking-widest uppercase mt-2">
                  {u.label}
                </div>
              </div>
              {i < units.length - 1 && (
                <span className="text-stone-500 text-3xl md:text-4xl pb-2">/</span>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
