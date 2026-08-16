import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import Experience from './components/experience/Experience'
import Overlay from './components/ui/Overlay'
import Nav from './components/ui/Nav'
import ProgressRail from './components/ui/ProgressRail'
import Cursor from './components/ui/Cursor'
import Loader from './components/ui/Loader'
import { journey } from './journey/journeyState'
import { SCROLL_LENGTH_VH } from './journey/chapters'
import { useIsMobile } from './hooks/useIsMobile'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

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
      <Experience isMobile={isMobile} onReady={() => setSceneReady(true)} />

      {/* invisible scroll distance — the film strip */}
      <div ref={trackRef} className="scroll-track" style={{ height: `${SCROLL_LENGTH_VH}vh` }} />

      <Overlay />
      <Nav />
      {!isMobile && <ProgressRail />}
      <Cursor />

      <div className="vignette" />
      <div className="grain" />

      <Loader sceneReady={sceneReady} />
    </>
  )
}
