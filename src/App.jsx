import { useEffect } from 'react'
import Nav from './components/ui/Nav'
import Cursor from './components/ui/Cursor'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Properties from './components/sections/Properties'
import Management from './components/sections/Management'
import Investment from './components/sections/Investment'
import WhyCRD from './components/sections/WhyCRD'
import Contact from './components/sections/Contact'

export default function App() {
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  }, [])

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Properties />
        <Management />
        <Investment />
        <WhyCRD />
        <Contact />
      </main>
      <Cursor />
      <div className="grain" />
    </>
  )
}
