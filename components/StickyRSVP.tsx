'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function StickyRSVP() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const form = document.getElementById('guest-form')

    const observer = new IntersectionObserver(
      ([entry]) => {
        // скрываем когда форма видна
        setVisible(!entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    if (form) observer.observe(form)

    const onScroll = () => {
      if (window.scrollY <= 100) setVisible(false)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const scrollToForm = () => {
    document.getElementById('guest-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-4 px-4 pointer-events-none"
        >
          <button
            onClick={scrollToForm}
            className="pointer-events-auto flex items-center gap-3 bg-charcoal text-white px-8 py-4 shadow-2xl text-sm tracking-widest uppercase hover:bg-stone-700 active:scale-95 transition-all duration-150"
          >
            <span className="font-sans">Подтвердить присутствие</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
