import { Sparkles } from 'lucide-react'

function Footer({ navLinks, onNavClick }) {
  return (
    <footer
      id="contact"
      className="border-t border-slate-200/80 px-4 py-10 transition-colors duration-300 dark:border-slate-800 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-950">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-semibold">Commandly AI</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Your AI command center for business growth.
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
            Commandly AI helps businesses save time, respond faster, and grow with
            one AI-powered dashboard.
          </p>
        </div>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between lg:gap-10">
          <nav className="flex flex-wrap gap-5 text-sm text-slate-600 dark:text-slate-300">
            {navLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => onNavClick(link.href.replace('#', ''))}
                className="transition hover:text-slate-950 dark:hover:text-white"
              >
                {link.label}
              </button>
            ))}
          </nav>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © 2026 Commandly AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
