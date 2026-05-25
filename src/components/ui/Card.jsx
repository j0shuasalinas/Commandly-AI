function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-sm transition dark:border-slate-800 dark:bg-slate-900/90 ${className}`}
    >
      {children}
    </div>
  )
}

export default Card
