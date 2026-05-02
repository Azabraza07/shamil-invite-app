'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const photos = [
  { src: '/photos/1.JPG', alt: 'Шамиль и Милана', style: { gridColumn: '1 / 3', gridRow: '1 / 3' } },
  { src: '/photos/2.JPG', alt: 'Шамиль и Милана', style: { gridColumn: '3 / 4', gridRow: '1 / 2' } },
  { src: '/photos/3.JPG', alt: 'Шамиль и Милана', style: { gridColumn: '3 / 4', gridRow: '2 / 3' } },
  { src: '/photos/4.JPG', alt: 'Шамиль и Милана', style: { gridColumn: '1 / 2', gridRow: '3 / 5' } },
  { src: '/photos/5.JPG', alt: 'Шамиль и Милана', style: { gridColumn: '2 / 4', gridRow: '3 / 5' } },
]

export default function PhotoGallery() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-24 px-4 bg-white" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="divider mb-8 text-stone-300">
            <span className="text-stone-300">◇</span>
          </div>
          <h2 className="font-serif text-5xl text-charcoal mb-4">Наши моменты</h2>
          <p className="text-stone-400 text-sm tracking-[0.2em] uppercase">История нашей любви</p>
        </motion.div>

        <div
          className="grid gap-2 md:gap-3"
          style={{
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'repeat(4, 180px)',
          }}
        >
          {photos.map((photo, i) => (
            <motion.div
              key={photo.src}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative overflow-hidden group"
              style={photo.style}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="divider mt-14 text-stone-300"
        >
          <span className="text-stone-300">◇</span>
        </motion.div>
      </div>
    </section>
  )
}
