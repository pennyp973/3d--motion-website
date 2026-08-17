import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import PhotoStage from './components/ui/PhotoStage'
import Overlay from './components/ui/Overlay'
import EditorialSlides from './components/ui/EditorialSlides'
import Nav from './components/ui/Nav'
import ProgressRail from './components/ui/ProgressRail'
import Cursor from './components/ui/Cursor'
import Loader from './components/ui/Loader'
import HeroCinematic from './components/ui/HeroCinematic'
import { journey } from './journey/journeyState'
import { SCROLL_LENGTH_VH } from './journey/chapters'
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
      <PhotoStage />

      {/* Act I — pinned cinematic film hero */}
      <HeroCinematic onReady={() => setSceneReady(true)} />

      {/* Act II — extended chapter journey. More distance makes the experience
          feel deliberate instead of rushing between scenes. */}
      <div
        ref={trackRef}
        id="journey-track"
        className="scroll-track"
        style={{ height: `${SCROLL_LENGTH_VH}vh` }}
      />

      <Overlay />
      <EditorialSlides />
      <Nav />
      {!isMobile && <ProgressRail />}
      <Cursor />

      <div className="vignette" />
      <div className="grain" />

      <Loader sceneReady={sceneReady} />
    </>
  )
}
