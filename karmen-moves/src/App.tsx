import { useEffect, useState } from 'react'
import { Nav, MobileEnquiryBar } from './components/Nav'
import { Hero } from './components/Hero'
import { FounderStory } from './components/FounderStory'
import { NeckHealer } from './components/NeckHealer'
import { Collection } from './components/Collection'
import { Why } from './components/Why'
import { Care } from './components/Care'
import { Contact } from './components/Contact'
import { Ending, Footer } from './components/Ending'
import { Privacy, Disclaimer } from './components/Legal'

/** Tiny hash router: '#/privacy' and '#/disclaimer' are pages, any other hash is an in-page anchor. */
function useRoute() {
  const read = () => (window.location.hash.startsWith('#/') ? window.location.hash.slice(1) : '/')
  const [route, setRoute] = useState(read)
  useEffect(() => {
    const on = () => {
      const next = read()
      setRoute((prev) => {
        if (prev !== next) window.scrollTo(0, 0)
        return next
      })
    }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return route
}

export default function App() {
  const route = useRoute()

  // Returning from a legal page to an in-page anchor: scroll there once home renders
  useEffect(() => {
    if (route === '/' && window.location.hash.length > 1) {
      document.querySelector(window.location.hash)?.scrollIntoView()
    }
  }, [route])

  if (route === '/privacy' || route === '/disclaimer') {
    return (
      <>
        <Nav alwaysVisible />
        {route === '/privacy' ? <Privacy /> : <Disclaimer />}
        <Footer />
      </>
    )
  }

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-charcoal focus:px-4 focus:py-2 focus:text-ivory">
        Skip to content
      </a>
      <Nav />
      <Hero />
      <main id="main">
        <FounderStory />
        <NeckHealer />
        <Collection />
        <Why />
        <Care />
        <Contact />
        <Ending />
      </main>
      <Footer />
      <MobileEnquiryBar />
    </>
  )
}
