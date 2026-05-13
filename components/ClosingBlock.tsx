import Image from 'next/image'

export default function ClosingBlock() {
  return (
    <footer className="bg-[#1c1c1c]">
      {/* Мобильный: колонка. Десктоп: текст по центру без фото */}
      <div className="flex flex-col md:block">

        {/* Фото — только мобильный */}
        <div className="relative w-full h-[70vw] min-h-[500px] max-h-[480px] md:hidden overflow-hidden">
          <Image
            src="/photos/113.JPG"
            alt="Шамиль и Милана"
            fill
            sizes="100vw"
            className="object-cover object-top"
            priority={false}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, transparent 55%, #1c1c1c 100%)' }}
          />
        </div>

        {/* Текст — мобильный снизу, десктоп по центру */}
        <div className="flex flex-col justify-center items-center text-center px-8 py-14 md:py-16">
          <p className="text-stone-400 text-sm tracking-widest mb-6">
            До скорой встречи! С любовью,
          </p>
          <p
            className="font-serif text-white leading-none tracking-[0.08em]"
            style={{ fontSize: 'clamp(2.8rem, 2vw, 3rem)' }}
          >
            ШАМИЛЬ
          </p>
          <p
            className="font-serif text-white leading-none tracking-[0.08em]"
            style={{ fontSize: 'clamp(2.8rem, 2vw, 3rem)' }}
          >
            <span style={{ fontSize: '0.55em' }} className="align-middle mr-2">&amp;</span>
            <br />
            МИЛАНА
          </p>
        </div>

      </div>
    </footer>
  )
}
