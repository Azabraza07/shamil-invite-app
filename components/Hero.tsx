import Image from 'next/image'

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-16 text-center overflow-hidden">
      <div className="flex flex-col items-center gap-6">

        {/* Заголовок — CSS анимация вместо Framer Motion */}
        <div className="overflow-hidden">
          <h1 className="font-serif font-light text-6xl md:text-8xl tracking-[0.15em] text-charcoal leading-tight">
            <span className="inline-block animate-hero-word" style={{ animationDelay: '0ms' }}>
              ШАМИЛЬ<br />
            </span>
            <span
              className="inline-block text-3xl md:text-4xl italic font-light mx-3 animate-hero-word"
              style={{ animationDelay: '150ms' }}
            >
              &amp;{' '}
            </span>
            <span className="inline-block animate-hero-word" style={{ animationDelay: '300ms' }}>
              МИЛАНА
            </span>
          </h1>
        </div>

        <div
          className="divider w-48 text-stone-300 text-sm tracking-[0.3em] text-stone-400 animate-divider"
          style={{ animationDelay: '600ms' }}
        >
          26 ИЮНЯ 2026
        </div>

        {/* Фото — priority + fetchPriority для максимально быстрого LCP */}
        <div className="mt-4 w-[280px] md:w-[380px] arch-frame shadow-lg overflow-hidden">
          <Image
            src="/photos/hero.JPG"
            alt="Шамиль и Милана"
            width={380}
            height={500}
            sizes="(max-width: 768px) 280px, 380px"
            className="object-cover w-full"
            priority
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  )
}
