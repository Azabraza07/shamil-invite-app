'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const palette = [
  { color: '#eae1d6', label: '' },
  { color: '#d6c0a8', label: '' },
  { color: '#e3beb5', label: '' },
  { color: '#97a380', label: '' },
  { color: '#7a5946', label: '' },
  { color: '#65653e', label: '' },
]

export default function DressCode() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      className="py-24 px-4"
      style={{ backgroundColor: '#f0eeeb' }}
      ref={ref}
    >
      <div className="max-w-2xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-serif text-5xl text-charcoal mb-6"
        >
          Дресс-код
        </motion.h2>

        {/*<motion.p*/}
        {/*  initial={{ opacity: 0 }}*/}
        {/*  animate={isInView ? { opacity: 1 } : {}}*/}
        {/*  transition={{ duration: 0.6, delay: 0.15 }}*/}
        {/*  className="text-stone-500 mb-10 leading-relaxed"*/}
        {/*>*/}
        {/*  Мы очень ждём и готовимся к нашему незабываемому дню! Поддержите нас*/}
        {/*  Вашими улыбками и объятиями, а также красивыми нарядами в палитре*/}
        {/*  мероприятия*/}
        {/*</motion.p>*/}

        <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-stone-500 mb-10 leading-relaxed"
        >
          Будем рады, если вы поддержите стиль нашего праздника и выберете наряды в палитре мероприятия
        </motion.p>

        <div className="grid grid-cols-3 sm:grid-cols-6 justify-items-center gap-x-4 gap-y-6 mb-10">
          {palette.map((p, i) => (
            <motion.div
              key={p.color}
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: [0.34, 1.56, 0.64, 1] }}
              className="flex flex-col items-center gap-2"
            >
              <div
                className="w-14 h-14 rounded-full shadow-sm border border-stone-200"
                style={{ backgroundColor: p.color }}
              />
              <span className="text-xs text-stone-400">{p.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Decorative flourish */}
        {/*<motion.div*/}
        {/*  initial={{ opacity: 0 }}*/}
        {/*  animate={isInView ? { opacity: 1 } : {}}*/}
        {/*  transition={{ duration: 0.6, delay: 0.35 }}*/}
        {/*  className="text-stone-300 text-4xl font-serif"*/}
        {/*>*/}
        {/*  ∞*/}
        {/*</motion.div>*/}
      </div>
    </section>
  )
}
