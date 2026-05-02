'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function Location() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-24 px-4 bg-white" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-serif text-5xl text-center text-charcoal mb-12"
        >
          Локация
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className="overflow-hidden rounded-sm shadow-md mb-8">
            <Image
              src="/photos/location.PNG"
              alt="База отдыха BalQaragay"
              width={900}
              height={500}
              sizes="(max-width: 768px) 100vw, 900px"
              className="w-full object-cover h-[300px] md:h-[420px]"
            />
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="font-serif text-2xl text-charcoal mb-1">
                База отдыха BalQaragay
              </h3>
              <p className="text-stone-500 mb-3">ул. Астана-Малотимофеевка, 2</p>
              <p className="text-charcoal font-medium">
                {/*Сбор гостей — <span className="font-semibold">16:00</span>*/}
              </p>
            </div>

            <a
              href="https://go.2gis.com/9BjvH"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-charcoal text-white px-8 py-3 text-sm tracking-widest uppercase hover:bg-stone-700 transition-colors whitespace-nowrap"
            >
              Как добраться
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
