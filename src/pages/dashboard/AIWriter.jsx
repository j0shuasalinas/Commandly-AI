import { useMemo, useState } from 'react'
import { Check, Copy, FileText, LoaderCircle, Save, Sparkles } from 'lucide-react'
import Card from '../../components/ui/Card'
import Dropdown from '../../components/ui/Dropdown'

const templateOptions = [
  'Instagram Caption',
  'Google Ad',
  'Email Campaign',
  'Website Copy',
  'Blog Idea',
  'Promotional Text',
]

const toneOptions = ['Professional', 'Friendly', 'Luxury', 'Bold', 'Casual']

const goalOptions = [
  'Get More Leads',
  'Promote a Sale',
  'Announce an Update',
  'Improve Retention',
  'Increase Bookings',
]

function AIWriter({ drafts = [], onGenerate, onSaveDraft, workspace }) {
  const [template, setTemplate] = useState(templateOptions[0])
  const [tone, setTone] = useState(workspace?.brand_voice || toneOptions[0])
  const [goal, setGoal] = useState(goalOptions[0])
  const [prompt, setPrompt] = useState(
    'Promote a premium summer detailing package for busy professionals.',
  )
  const [generated, setGenerated] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const output = useMemo(() => {
    if (!generated) {
      return ''
    }

    return `${template} - ${tone} tone - ${goal}\n\n${generated}`
  }, [generated, goal, template, tone])

  const handleGenerate = async () => {
    setLoading(true)
    setError('')
    setCopied(false)

    try {
      const response = await onGenerate?.({
        goal,
        mode: 'writer',
        prompt,
        template,
        tone,
      })

      setGenerated(response?.text || '')
    } catch (nextError) {
      setError(nextError.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
  }

  return (
    <div className="grid gap-6 2xl:grid-cols-[1.15fr_0.85fr]">
      <Card>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
              AI Writer
            </h1>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
              Generate polished marketing copy with Gemini and save the drafts back to your workspace.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Dropdown
            className="w-full"
            items={templateOptions.map((item) => ({ id: item, label: item }))}
            label={template}
            onSelect={(item) => setTemplate(item.label)}
            triggerClassName="w-full justify-between"
          />
          <Dropdown
            className="w-full"
            items={toneOptions.map((item) => ({ id: item, label: item }))}
            label={tone}
            onSelect={(item) => setTone(item.label)}
            triggerClassName="w-full justify-between"
          />
          <Dropdown
            className="w-full"
            items={goalOptions.map((item) => ({ id: item, label: item }))}
            label={goal}
            onSelect={(item) => setGoal(item.label)}
            triggerClassName="w-full justify-between"
          />
        </div>

        <textarea
          rows="6"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          className="mt-6 w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
        />

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {loading ? 'Generating...' : 'Generate'}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!output}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            type="button"
            onClick={() =>
              onSaveDraft?.({
                goal,
                output,
                prompt,
                template,
                title: `${template} Draft`,
                tone,
              })
            }
            disabled={!output}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </button>
        </div>

        {error && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
            {error}
          </div>
        )}

        <Card className="mt-6 bg-slate-50 dark:bg-slate-950">
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
            Generated output
          </h3>
          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-300">
            {output || 'Choose a template, update the prompt, and generate a draft.'}
          </p>
        </Card>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
          Saved drafts
        </h3>
        <div className="mt-5 space-y-4">
          {drafts.length > 0 ? (
            drafts.map((draft) => (
              <div
                key={draft.id}
                className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">
                      {draft.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {draft.template || 'Draft'} - {draft.tone || 'Tone'}
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {draft.output}
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center dark:border-slate-800 dark:bg-slate-950">
              <div className="text-base font-semibold text-slate-900 dark:text-white">
                No saved drafts yet
              </div>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Save generated copy and it will persist here for your account.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default AIWriter
