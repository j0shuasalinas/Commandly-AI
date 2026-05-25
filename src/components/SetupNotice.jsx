function SetupNotice() {
  return (
    <div className="rounded-[1.75rem] border border-amber-200 bg-amber-50 p-6 shadow-sm dark:border-amber-500/20 dark:bg-amber-500/10">
      <div className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">
        Supabase Setup Required
      </div>
      <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">
        Add your Supabase project keys to turn this into a live app.
      </h2>
      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
        Create a `.env.local` file with `VITE_SUPABASE_URL` and
        `VITE_SUPABASE_ANON_KEY`, then run the SQL in `supabase/schema.sql`.
      </p>
    </div>
  )
}

export default SetupNotice
