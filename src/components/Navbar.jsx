import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { Menu, MoonStar, Sparkles, SunMedium, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Navbar({ theme, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { loading, user, workspace } = useAuth()

  const navLinks = [
    { label: 'Features', id: 'features' },
    { label: 'Dashboard', id: 'dashboard' },
    { label: 'Pricing', id: 'pricing' },
    { label: 'Contact', id: 'contact' },
  ]

  const handleSectionClick = (sectionId) => {
    setMenuOpen(false)

    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`)
      return
    }

    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.replaceState({}, '', `/#${sectionId}`)
  }

  const handlePrimaryAction = () => {
    setMenuOpen(false)

    if (!user) {
      navigate('/auth?mode=signup')
      return
    }

    navigate(workspace ? '/dashboard' : '/onboarding')
  }

  const primaryLabel = loading
    ? 'Loading'
    : !user
      ? 'Get Started'
      : workspace
        ? 'Dashboard'
        : 'Finish Setup'

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/75 backdrop-blur-xl transition-colors duration-300 dark:border-slate-800/80 dark:bg-slate-950/70">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-glow dark:bg-white dark:text-slate-950">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-semibold tracking-tight">Commandly AI</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Your AI command center for business growth.
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => handleSectionClick(link.id)}
                className="text-sm font-medium text-slate-600 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleTheme}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:text-white"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <SunMedium className="h-5 w-5" />
              ) : (
                <MoonStar className="h-5 w-5" />
              )}
            </button>

            <button
              type="button"
              onClick={handlePrimaryAction}
              className="hidden rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-600 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 sm:inline-flex"
            >
              {primaryLabel}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 md:hidden dark:border-slate-800 dark:text-slate-300"
              aria-label="Open navigation"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="mt-4 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-card md:hidden dark:border-slate-800 dark:bg-slate-900">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => handleSectionClick(link.id)}
                  className="rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  {link.label}
                </button>
              ))}
              <button
                type="button"
                onClick={handlePrimaryAction}
                className="mt-2 inline-flex justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                {primaryLabel}
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
