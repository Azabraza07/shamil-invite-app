import Image from 'next/image'

export default function ClosingBlock() {
  return (
    <footer>
      {/* Фото */}
      <div className="relative w-full h-[100vh] max-h-[600px] min-h-[300px] overflow-hidden">
        <Image
          src="/photos/5.JPG"
          alt="Шамиль и Милана"
          fill
          sizes="100vw"
          className="object-cover object-top"
          priority={false}
        />
        {/* Градиент вниз */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 50%, #1c1c1c 100%)',
          }}
        />
      </div>

      {/* Тёмный блок с текстом */}
      <div className="bg-[#1c1c1c] text-center px-6 pb-14 pt-2">
        <p className="text-stone-400 text-sm tracking-widest mb-4">
          До скорой встречи! С любовью,
        </p>
        <p className="font-serif text-white leading-none tracking-[0.08em]"
          style={{ fontSize: 'clamp(2.8rem, 10vw, 6.5rem)' }}>
          ШАМИЛЬ
        </p>
        <p className="font-serif text-white leading-none tracking-[0.08em]"
          style={{ fontSize: 'clamp(2.8rem, 10vw, 6.5rem)' }}>
          <span style={{ fontSize: '0.55em' }} className="align-middle mr-2">&amp;</span>
            <br/>
          МИЛАНА
        </p>
      </div>
    </footer>
  )
}
