'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={ref} className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-16 text-center overflow-hidden">
      <motion.div style={{ opacity }} className="flex flex-col items-center gap-6">

        {/* Заголовок — каждое слово появляется по очереди */}
        <div className="overflow-hidden">
          <motion.h1
            className="font-serif font-light text-6xl md:text-8xl tracking-[0.15em] text-charcoal leading-tight"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.15 } },
            }}
          >
            {['ШАМИЛЬ', '& ', 'МИЛАНА'].map((word, i) => (
              <motion.span
                key={i}
                className={`inline-block ${word === '& ' ? 'text-3xl md:text-4xl italic font-light mx-3' : ''}`}
                variants={{
                  hidden: { opacity: 0, y: 60 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } },
                }}
              >
                {word === 'ШАМИЛЬ' ? (
                  <>{word}<br /></>
                ) : word}
              </motion.span>
            ))}
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          className="divider w-48 text-stone-300 text-sm tracking-[0.3em] text-stone-400"
        >
          26 ИЮНЯ 2026
        </motion.div>

        {/* Фото с параллаксом */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-4 w-[280px] md:w-[380px] arch-frame shadow-lg overflow-hidden"
        >
          <motion.div style={{ y: imageY }}>
            <Image
              src="/photos/hero.JPG"
              alt="Шамиль и Милана"
              width={380}
              height={500}
              className="object-cover w-full"
              priority
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
