import { LayoutWrapper } from '@/components/layout/layout-wrapper'
import { HeroSection } from '@/components/home/hero-section'
import { FeaturedCollections } from '@/components/home/featured-collections'
import { WhyMayura } from '@/components/home/why-mayura'
import { RequestLook } from '@/components/home/request-look'

export default function Home() {
  return (
    <LayoutWrapper>
      <HeroSection />
      <FeaturedCollections />
      <WhyMayura />
      <RequestLook />
    </LayoutWrapper>
  )
}
