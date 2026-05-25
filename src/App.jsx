import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import Navbar from './components/Navbar'
import ProtectedRoute from './routes/ProtectedRoute'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import HomePage from './pages/HomePage'
import OnboardingPage from './components/OnboardingPage'

const THEME_KEY = 'commandly-theme'

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem(THEME_KEY)

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function App() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50">
      <div className="absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[radial-gradient(circle_at_top,rgba(74,111,255,0.20),transparent_34%),radial-gradient(circle_at_18%_20%,rgba(155,92,255,0.14),transparent_28%)] dark:bg-[radial-gradient(circle_at_top,rgba(74,111,255,0.20),transparent_30%),radial-gradient(circle_at_18%_20%,rgba(155,92,255,0.16),transparent_26%)]" />
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <Routes>
        <Route path="/" element={<HomePage theme={theme} />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage theme={theme} onToggleTheme={toggleTheme} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
