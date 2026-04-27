import Hero from '@/components/Hero'
import Intro from '@/components/Intro'
import DateSection from '@/components/DateSection'
import Location from '@/components/Location'
import Timeline from '@/components/Timeline'
import DressCode from '@/components/DressCode'
import Countdown from '@/components/Countdown'
import GuestForm from '@/components/GuestForm'
// import StickyRSVP from '@/components/StickyRSVP'
import FadeIn from '@/components/FadeIn'

export default function Home() {
  return (
    <main>
      <Hero />

      <FadeIn direction="up">
        <Intro />
      </FadeIn>

      <FadeIn direction="up" delay={0.05}>
        <DateSection />
      </FadeIn>

      <FadeIn direction="up" delay={0.05}>
        <Location />
      </FadeIn>

      <FadeIn direction="up" delay={0.05}>
        <Timeline />
      </FadeIn>

      <FadeIn direction="up" delay={0.05}>
        <DressCode />
      </FadeIn>

      <FadeIn direction="up" delay={0.05}>
        <Countdown />
      </FadeIn>

      <FadeIn direction="up" delay={0.05}>
        <GuestForm />
      </FadeIn>

      <FadeIn direction="up" delay={0.05}>
        <footer className="py-10 bg-charcoal text-center">
          <p className="font-serif text-2xl text-white mb-1">
            До скорой встречи!
          </p>
          <p className="text-stone-400 text-sm">
            С любовью, Шамиль & Милана
          </p>
        </footer>
      </FadeIn>

      {/* <StickyRSVP /> */}
    </main>
  )
}
