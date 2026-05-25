import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import Dashboard from '../components/Dashboard'
import Features from '../components/Features'
import FinalCta from '../components/FinalCta'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import Pricing from '../components/Pricing'
import { useAuth } from '../context/AuthContext'

function HomePage({ theme }) {
  const [promptValue, setPromptValue] = useState('')
  const { user, workspace } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const navLinks = useMemo(
    () => [
      { label: 'Features', href: '#features' },
      { label: 'Dashboard', href: '#dashboard' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Contact', href: '#contact' },
    ],
    [],
  )

  useEffect(() => {
    if (!location.hash) {
      return
    }

    const id = location.hash.replace('#', '')
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [location.hash])

  const handleGetStarted = () => {
    if (user) {
      navigate(workspace ? '/dashboard' : '/onboarding')
      return
    }

    navigate('/auth?mode=signup')
  }

  const navigateSection = (targetId) => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.replaceState({}, '', `/#${targetId}`)
  }

  return (
    <>
      <main>
        <Hero
          navLinks={navLinks}
          theme={theme}
          onGetStarted={handleGetStarted}
          onPromptSelect={setPromptValue}
        />
        <Features />
        <HowItWorks />
        <Dashboard
          ownerName="Josh"
          promptValue={promptValue}
          setPromptValue={setPromptValue}
          theme={theme}
          workspaceName="Commandly AI"
        />
        <Pricing />
        <FinalCta onGetStarted={handleGetStarted} />
      </main>
      <Footer navLinks={navLinks} onNavClick={navigateSection} />
    </>
  )
}

export default HomePage
