import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

function Dropdown({
  align = 'left',
  className = '',
  emptyStateText = 'Nothing here yet.',
  items = [],
  label,
  onSelect,
  renderLabel,
  showChevron = true,
  triggerClassName = '',
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!ref.current?.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const alignmentClass =
    align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white ${triggerClassName}`}
      >
        {renderLabel ? renderLabel() : <span>{label}</span>}
        {showChevron && <ChevronDown className="h-4 w-4" />}
      </button>

      {open && (
        <div
          className={`absolute z-50 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_48px_rgba(15,23,42,0.16)] dark:border-slate-800 dark:bg-slate-900 ${alignmentClass}`}
        >
          {items.length > 0 ? (
            items.map((item) => (
              <button
                key={item.id ?? item.label}
                type="button"
                onClick={() => {
                  setOpen(false)
                  onSelect?.(item)
                }}
                className="flex w-full items-start justify-between rounded-xl px-3 py-3 text-left transition hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <div>
                  <div className="text-sm font-medium text-slate-900 dark:text-white">
                    {item.label}
                  </div>
                  {item.description && (
                    <div className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      {item.description}
                    </div>
                  )}
                </div>
                {item.badge && (
                  <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                    {item.badge}
                  </span>
                )}
              </button>
            ))
          ) : (
            <div className="px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
              {emptyStateText}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Dropdown
