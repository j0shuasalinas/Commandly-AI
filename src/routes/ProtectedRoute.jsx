import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {
  const location = useLocation()
  const { loading, user, isSupabaseConfigured } = useAuth()

  if (!isSupabaseConfigured) {
    return children
  }

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white px-8 py-10 text-center shadow-card dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-darkcard">
          <div className="text-lg font-semibold text-slate-950 dark:text-white">
            Loading your workspace...
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth?mode=signin" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute
