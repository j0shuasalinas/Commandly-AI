import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'

function AuthCallbackPage() {
  const navigate = useNavigate()
  const { loading, user, workspace } = useAuth()

  useEffect(() => {
    if (loading) {
      return
    }

    if (!user) {
      navigate('/auth?mode=signin', { replace: true })
      return
    }

    navigate(workspace ? '/dashboard?verified=1' : '/onboarding?verified=1', {
      replace: true,
    })
  }, [loading, navigate, user, workspace])

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="rounded-[1.75rem] border border-slate-200 bg-white px-8 py-10 text-center shadow-card dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-darkcard">
        <div className="text-lg font-semibold text-slate-950 dark:text-white">
          Finishing your sign-in...
        </div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Commandly AI is securing your session and preparing your workspace.
        </p>
      </div>
    </main>
  )
}

export default AuthCallbackPage
