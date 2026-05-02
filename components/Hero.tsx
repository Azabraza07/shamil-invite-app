import Image from 'next/image'

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-16 text-center overflow-hidden">
      <div className="flex flex-col items-center gap-6">

        {/* Заголовок — CSS анимация вместо Framer Motion */}
        <div className="overflow-hidden">
          {/*<h1 className="font-serif font-light text-6xl md:text-8xl tracking-[0.15em] text-charcoal leading-tight">*/}
          {/*  <span className="inline-block animate-hero-word" style={{ animationDelay: '0ms' }}>*/}
          {/*    ШАМИЛЬ<br />*/}
          {/*  </span>*/}
          {/*  <span*/}
          {/*    className="inline-block text-3xl md:text-4xl italic font-light mx-3 animate-hero-word"*/}
          {/*    style={{ animationDelay: '150ms' }}*/}
          {/*  >*/}
          {/*    <br/>*/}
          {/*    &amp;{' '}*/}
          {/*  </span>*/}
          {/*  <span className="inline-block animate-hero-word" style={{ animationDelay: '300ms' }}>*/}
          {/*    МИЛАНА*/}
          {/*  </span>*/}
          {/*</h1>*/}
          <p className="font-serif  leading-none tracking-[0.08em]"
             style={{ fontSize: 'clamp(2.8rem, 10vw, 6.5rem)' }}>
            ШАМИЛЬ
          </p>
          <p className="font-serif  leading-none tracking-[0.08em]"
             style={{ fontSize: 'clamp(2.8rem, 10vw, 6.5rem)' }}>
            <span style={{ fontSize: '0.55em' }} className="align-middle mr-2">&amp;</span>
            <br/>
            МИЛАНА
          </p>
        </div>

        <div
          className=" w-48 text-stone-300 text-sm tracking-[0.3em] text-gray-700 "
          style={{ animationDelay: '600ms' }}
        >
          26 ИЮНЯ 2026
        </div>

        {/* Фото — priority + fetchPriority для максимально быстрого LCP */}
        <div className="relative mt-4 w-[340px] md:w-[320px] h-[500px] md:h-[520px] arch-frame shadow-lg overflow-hidden">
          <Image
            src="/photos/1.JPG"
            alt="Шамиль и Милана"
            fill
            sizes="(max-width: 768px) 260px, 320px"
            className="object-cover object-top"
            priority
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  )
}
