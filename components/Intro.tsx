'use client'

import Image from 'next/image'
import {motion} from 'framer-motion'
import {useInView} from 'framer-motion'
import {useRef} from 'react'

export default function Intro() {
    const ref = useRef(null)
    const isInView = useInView(ref, {once: true, margin: '-100px'})

    return (
        <section id="intro" className="py-24 px-4 bg-white">
            <div className="max-w-5xl mx-auto" ref={ref}>
                <div className="divider mb-16 text-stone-300">
                    <span className="text-stone-300">◇</span>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-12">
                    <motion.div
                        initial={{opacity: 0, x: -40}}
                        animate={isInView ? {opacity: 1, x: 0} : {}}
                        transition={{duration: 0.7}}
                        className="flex-shrink-0"
                    >
                        {/* Полароид-фрейм */}
                        <div className="bg-white p-3 pb-8 shadow-xl rotate-[-2deg] w-[240px] md:w-[280px]">
                            <Image
                                src="/photos/10.JPG"
                                alt="Шамиль и Милана"
                                width={280}
                                height={340}
                                sizes="(max-width: 768px) 240px, 280px"
                                className="object-cover w-full"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, x: 40}}
                        animate={isInView ? {opacity: 1, x: 0} : {}}
                        transition={{duration: 0.7, delay: 0.15}}
                        className="flex-1"
                    >
                        <h2 className="font-serif text-4xl md:text-5xl text-charcoal mb-6">
                            Этот момент настал!
                        </h2>
                        <p className="text-stone-500 leading-relaxed mb-4">
                            Совсем скоро состоится одно из самых важных и трепетных событий <br/> в нашей жизни - день нашей свадьбы!
                        </p>

                        {/*<p className="text-stone-500 leading-relaxed mb-4">*/}
                        {/*  Мы верим, что этот день послужит началом нашей счастливой жизни.*/}
                        {/*  Поэтому не представляем наш праздник без Вашего участия!*/}
                        {/*</p>*/}
                        {/*<p className="text-stone-500 leading-relaxed">*/}
                        {/*  Разделите с нами это главное событие лета — подарите нам своё*/}
                        {/*  внимание и поддержку.*/}
                        {/*</p>*/}
                    </motion.div>
                </div>

                <div className="divider mt-16 text-stone-300">
                    <span className="text-stone-300">◇</span>
                </div>
            </div>
        </section>
    )
}
