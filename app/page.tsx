import dynamic from 'next/dynamic'
import Hero from '@/components/Hero'
import Intro from '@/components/Intro'
import PhotoGallery from '@/components/PhotoGallery'
import DateSection from '@/components/DateSection'
import Location from '@/components/Location'
import FadeIn from '@/components/FadeIn'
import ClosingBlock from '@/components/ClosingBlock'

const Timeline = dynamic(() => import('@/components/Timeline'))
const DressCode = dynamic(() => import('@/components/DressCode'))
const Countdown = dynamic(() => import('@/components/Countdown'))
const GuestForm = dynamic(() => import('@/components/GuestForm'))

export default function Home() {
  return (
    <main>
      <Hero />

      <FadeIn direction="up">
        <Intro />
      </FadeIn>

      {/*<FadeIn direction="up" delay={0.05}>*/}
      {/*  <PhotoGallery />*/}
      {/*</FadeIn>*/}

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

      <ClosingBlock />

      {/* <StickyRSVP /> */}
    </main>
  )
}
