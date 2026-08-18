import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import RoomStage from './components/rooms/RoomStage'
import RoomInfo from './components/rooms/RoomInfo'
import RoomNavigator from './components/rooms/RoomNavigator'
import Overlay from './components/ui/Overlay'
import Nav from './components/ui/Nav'
import Cursor from './components/ui/Cursor'
import Loader from './components/ui/Loader'
import HeroCinematic from './components/ui/HeroCinematic'
import BuildWithUs from './components/build/BuildWithUs'
import ClosingSection from './components/closing/ClosingSection'
import { journey } from './journey/journeyState'
import { JOURNEY_VH } from './journey/rooms'
import { useIsMobile } from './hooks/useIsMobile'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
// Scroll-scrubbed site: tween time must track real time even under
// frame jank, or scroll-synced motion desynchronizes.
gsap.ticker.lagSmoothing(0)

export default function App() {
  const trackRef = useRef()
  const [sceneReady, setSceneReady] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)

    const st = ScrollTrigger.create({
      trigger: trackRef.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        journey.progress = self.progress
      },
    })

    return () => st.kill()
  }, [])

  return (
    <>
      <RoomStage isMobile={isMobile} />

      {/* Act I — pinned cinematic film hero */}
      <HeroCinematic onReady={() => setSceneReady(true)} />

      {/* Act II — travelling through the residence, room by room */}
      <div ref={trackRef} id="journey-track" className="scroll-track" style={{ height: `${JOURNEY_VH}vh` }} />

      {/* Act III — step outside and raise a building */}
      <div id="build">
        <BuildWithUs />
      </div>

      {/* Act IV — the invitation, back at the house at dusk */}
      <ClosingSection />

      <RoomInfo />
      <Overlay />
      <Nav />
      <RoomNavigator />
      <Cursor />

      <div className="vignette" />
      <div className="grain" />

      <Loader sceneReady={sceneReady} />
    </>
  )
}
