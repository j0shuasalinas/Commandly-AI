import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CalendarClock,
  Check,
  Copy,
  Filter,
  LoaderCircle,
  Mail,
  MessageSquareText,
  Phone,
  Search,
  Sparkles,
  Upload,
  UserRoundPlus,
  WandSparkles,
  X,
} from 'lucide-react'
import Card from '../../components/ui/Card'
import Dropdown from '../../components/ui/Dropdown'
import Modal from '../../components/ui/Modal'
import { getStoredMockIntegration, sendMockEmail, sendMockSms } from '../../lib/integrationClient'

const statusOptions = ['All', 'New', 'Contacted', 'Hot', 'Proposal Sent', 'Won', 'Lost']
const sourceOptions = ['All', 'Website', 'Instagram', 'Google', 'Referral', 'Manual', 'Email', 'SMS']
const interestOptions = ['Pricing', 'Booking', 'Consultation', 'Quote', 'Product Info', 'Follow-Up', 'Other']
const contactMethodOptions = ['Email', 'SMS', 'Phone', 'Any']
const followUpFilterOptions = ['All', 'Due Today', 'Overdue', 'Upcoming']
const followUpToneOptions = ['Professional', 'Friendly', 'Luxury', 'Bold', 'Casual']
const followUpChannelOptions = ['Email', 'SMS']
const followUpGoalOptions = ['Book Appointment', 'Send Quote', 'Follow Up', 'Re-Engage', 'Close Sale']
const viewOptions = ['Table View', 'Pipeline View']
const assignedPeople = ['Josh Salinas', 'Nia Coleman', 'Chris Howard', 'Front Desk', 'Sales Team']

const demoLeads = [
  {
    assignedTo: 'Josh Salinas',
    email: 'avery@citydrivenco.com',
    estimatedValue: 220,
    followUpDate: '2026-05-28',
    id: 'demo-avery',
    interest: 'Pricing',
    lastContact: 'Today, 9:15 AM',
    name: 'Avery Brooks',
    notes:
      'Asked about a monthly detailing package for a work SUV. Wants recurring options and premium add-ons.',
    phone: '(555) 410-1128',
    preferredContactMethod: 'Email',
    source: 'Website',
    status: 'New',
    nextStep: 'Send monthly package breakdown',
    timeline: [
      { id: 't1', title: 'Lead created', detail: 'Website form submitted for monthly detailing.', time: 'Today, 8:48 AM' },
      { id: 't2', title: 'Follow-up scheduled', detail: 'Quote breakdown queued for later today.', time: 'Today, 9:00 AM' },
    ],
  },
  {
    assignedTo: 'Nia Coleman',
    email: 'sofia.martinez@gmail.com',
    estimatedValue: 160,
    followUpDate: '2026-05-28',
    id: 'demo-sofia',
    interest: 'Booking',
    lastContact: 'Yesterday, 4:20 PM',
    name: 'Sofia Martinez',
    notes:
      'Responded after a Google review follow-up and wants the next available weekend slot.',
    phone: '(555) 208-4510',
    preferredContactMethod: 'SMS',
    source: 'Google',
    status: 'Contacted',
    nextStep: 'Confirm weekend availability',
    timeline: [
      { id: 't3', title: 'Lead created', detail: 'Google review follow-up converted to a booking inquiry.', time: 'Yesterday, 3:55 PM' },
      { id: 't4', title: 'Message sent', detail: 'Sent scheduling options by SMS.', time: 'Yesterday, 4:20 PM' },
    ],
  },
  {
    assignedTo: 'Chris Howard',
    email: 'marcus.hill@northcrestmail.com',
    estimatedValue: 480,
    followUpDate: '2026-05-30',
    id: 'demo-marcus',
    interest: 'Consultation',
    lastContact: '2 days ago',
    name: 'Marcus Hill',
    notes:
      'Instagram lead asking about ceramic coating for a new black coupe. Interested in premium finish and long-term protection.',
    phone: '(555) 907-3314',
    preferredContactMethod: 'Phone',
    source: 'Instagram',
    status: 'Hot',
    nextStep: 'Call to explain ceramic coating package',
    timeline: [
      { id: 't5', title: 'Lead created', detail: 'Instagram DM asked about ceramic coating.', time: '2 days ago' },
      { id: 't6', title: 'Status changed', detail: 'Lead moved to Hot after pricing conversation.', time: 'Yesterday' },
    ],
  },
  {
    assignedTo: 'Josh Salinas',
    email: 'danielkim@oakroute.co',
    estimatedValue: 320,
    followUpDate: '2026-05-29',
    id: 'demo-daniel',
    interest: 'Quote',
    lastContact: 'Yesterday',
    name: 'Daniel Kim',
    notes:
      'Referral lead needs a quote for two cars before a family event next week.',
    phone: '(555) 620-9105',
    preferredContactMethod: 'Email',
    source: 'Referral',
    status: 'Proposal Sent',
    nextStep: 'Follow up on two-car quote approval',
    timeline: [
      { id: 't7', title: 'Lead created', detail: 'Referral lead submitted for two-car service.', time: '3 days ago' },
      { id: 't8', title: 'Message sent', detail: 'Quote proposal emailed to Daniel.', time: 'Yesterday' },
    ],
  },
  {
    assignedTo: 'Front Desk',
    email: 'jasmine@reedfamilymail.com',
    estimatedValue: 140,
    followUpDate: '2026-05-31',
    id: 'demo-jasmine',
    interest: 'Booking',
    lastContact: 'Not contacted',
    name: 'Jasmine Reed',
    notes:
      'Email lead asking whether weekend availability is open for a detail before a road trip.',
    phone: '(555) 118-3407',
    preferredContactMethod: 'Email',
    source: 'Email',
    status: 'New',
    nextStep: 'Offer weekend openings',
    timeline: [
      { id: 't9', title: 'Lead created', detail: 'Inbound email asking about weekend detailing.', time: 'Today, 7:35 AM' },
    ],
  },
]

const defaultLeadForm = {
  assignedTo: 'Josh Salinas',
  email: '',
  estimatedValue: '',
  followUpDate: '',
  fullName: '',
  interest: 'Pricing',
  leadNotes: '',
  nextStep: '',
  phone: '',
  preferredContactMethod: 'Email',
  source: 'Website',
  status: 'New',
}

const defaultFollowUpForm = {
  channel: 'Email',
  context: '',
  goal: 'Follow Up',
  tone: 'Professional',
}

const statusStyles = {
  Contacted: 'border border-brand-500/20 bg-brand-500/10 text-brand-300',
  Hot: 'border border-rose-500/20 bg-rose-500/10 text-rose-300',
  Lost: 'border border-slate-500/20 bg-slate-500/10 text-slate-300',
  New: 'border border-slate-500/20 bg-slate-500/10 text-slate-300',
  'Proposal Sent': 'border border-violet-500/20 bg-violet-500/10 text-violet-300',
  Won: 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
}

const sourceStyles = {
  Email: 'bg-cyan-500/10 text-cyan-300',
  Google: 'bg-amber-500/10 text-amber-300',
  Instagram: 'bg-fuchsia-500/10 text-fuchsia-300',
  Manual: 'bg-slate-500/10 text-slate-300',
  Referral: 'bg-emerald-500/10 text-emerald-300',
  SMS: 'bg-indigo-500/10 text-indigo-300',
  Website: 'bg-brand-500/10 text-brand-300',
}

const normalizeLead = (lead, extras = {}) => ({
  activity: extras.activity || [],
  assignedTo: extras.assignedTo || 'Josh Salinas',
  archived: extras.archived || false,
  email: lead.email || '',
  estimatedValue: extras.estimatedValue ?? '',
  followUpDate: extras.followUpDate || '',
  id: lead.id,
  interest: extras.interest || 'Pricing',
  lastContact: lead.last_contact || extras.lastContact || 'Not contacted',
  name: lead.name,
  nextStep: lead.next_step || extras.nextStep || 'Generate follow-up',
  notes: lead.note || extras.notes || '',
  notesHistory: extras.notesHistory || [],
  phone: lead.phone || '',
  preferredContactMethod: extras.preferredContactMethod || 'Email',
  source: lead.source || 'Manual',
  status: lead.status || 'New',
  timeline:
    extras.timeline || [
      {
        detail: `${lead.name} was added to the workspace from ${lead.source || 'Manual'}.`,
        id: `created-${lead.id}`,
        time: lead.updated_at ? new Date(lead.updated_at).toLocaleString() : 'Recently',
        title: 'Lead created',
      },
    ],
})

const todayKey = new Date().toISOString().slice(0, 10)

const parseDateKey = (value) => {
  if (!value) return null
  return new Date(`${value}T12:00:00`).getTime()
}

const formatCurrency = (value) => `$${Number(value || 0).toLocaleString()}`

const formatDownload = (filename, content, type) => {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

const buildFollowUpMessage = ({ businessType, channel, context, goal, lead, tone }) => {
  const intro =
    tone === 'Luxury'
      ? 'refined, premium, and confident'
      : tone === 'Friendly'
        ? 'warm, clear, and approachable'
        : tone === 'Bold'
          ? 'direct, energetic, and action-first'
          : tone === 'Casual'
            ? 'relaxed, simple, and helpful'
            : 'professional, polished, and trustworthy'

  if (channel === 'SMS') {
    const text = `Hi ${lead.name.split(' ')[0]}, thanks again for reaching out about ${lead.interest.toLowerCase()}. ${context || `We help ${businessType.toLowerCase()} clients move quickly from interest to booking.`} If you'd like, I can send the next step today and help you lock this in.`
    return {
      body: text.slice(0, 320),
      channel: 'SMS',
      cta: 'Reply here and I can send the next step.',
    }
  }

  return {
    body: `Hi ${lead.name},\n\nThanks again for reaching out about ${lead.interest.toLowerCase()}. I put together a ${intro} follow-up based on what you shared.\n\n${context || `Because you're looking for ${lead.interest.toLowerCase()}, I wanted to make the next step simple and tailored to your needs.`}\n\nWe can help you move forward with ${lead.nextStep.toLowerCase()} and keep the process clear from here.\n\n${goal === 'Send Quote' ? 'If you want, I can send the quote details over today.' : goal === 'Book Appointment' ? 'If you are ready, I can help lock in the best available appointment time.' : 'Let me know if you want me to send the next best option and I’ll get it over right away.'}\n\nBest,\nCommandly AI Team`,
    channel: 'Email',
    cta:
      goal === 'Book Appointment'
        ? 'Reply to book your appointment.'
        : goal === 'Close Sale'
          ? 'Reply today and let’s move this forward.'
          : 'Reply and I can send the next step.',
    signature: 'Commandly AI Team',
    subject: `${lead.name.split(' ')[0]}, quick follow-up on your ${lead.interest.toLowerCase()} request`,
  }
}

function ToastStack({ toasts }) {
  return (
    <div className="fixed bottom-24 right-6 z-[90] grid gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-card dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}

function Badge({ children, tone = 'status' }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
        tone === 'status'
          ? statusStyles[children] || statusStyles.New
          : sourceStyles[children] || sourceStyles.Manual
      }`}
    >
      {children}
    </span>
  )
}

function StatCard({ label, value, detail }) {
  return (
    <Card className="p-5">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
        {label}
      </div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
        {value}
      </div>
      <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">{detail}</div>
    </Card>
  )
}

function LeadDrawer({
  businessType,
  followUpDraft,
  followUpForm,
  lead,
  noteText,
  onChangeFollowUpForm,
  onClose,
  onEdit,
  onGenerateFollowUp,
  onMarkAsContacted,
  onMoveToHot,
  onMarkWon,
  onSaveFollowUpToTimeline,
  onSendEmail,
  onSendSms,
  onScheduleFollowUp,
  onSaveNote,
  onSetNoteText,
  onSetShowFollowUpModal,
}) {
  if (!lead) return null

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto border-l border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-[#071120]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">{lead.name}</h2>
              <Badge>{lead.status}</Badge>
              <Badge tone="source">{lead.source}</Badge>
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Personalized CRM profile for a {businessType?.toLowerCase() || 'local business'} lead.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            { label: 'Email', value: lead.email || 'No email saved' },
            { label: 'Phone', value: lead.phone || 'No phone saved' },
            { label: 'Preferred Contact Method', value: lead.preferredContactMethod },
            { label: 'Interest', value: lead.interest },
            { label: 'Estimated Value', value: formatCurrency(lead.estimatedValue) },
            { label: 'Assigned To', value: lead.assignedTo },
            { label: 'Last Contact', value: lead.lastContact },
            { label: 'Next Step', value: lead.nextStep },
            { label: 'Follow-Up Date', value: lead.followUpDate || 'Not set' },
          ].map((item) => (
            <Card key={item.label} className="p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                {item.label}
              </div>
              <div className="mt-2 text-sm text-slate-700 dark:text-slate-300">{item.value}</div>
            </Card>
          ))}
        </div>

        <Card className="mt-4 p-5">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
            Notes
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-300">
            {lead.notes || 'No notes yet.'}
          </p>
        </Card>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              onGenerateFollowUp()
              onSetShowFollowUpModal(true)
            }}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            <WandSparkles className="h-4 w-4" />
            Generate Follow-Up
          </button>
          <button
            type="button"
            onClick={onSendEmail}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
          >
            <Mail className="h-4 w-4" />
            Send Email
          </button>
          <button
            type="button"
            onClick={onSendSms}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
          >
            <Phone className="h-4 w-4" />
            Send SMS
          </button>
          <button
            type="button"
            onClick={onMarkAsContacted}
            className="inline-flex rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
          >
            Mark as Contacted
          </button>
          <button
            type="button"
            onClick={onMoveToHot}
            className="inline-flex rounded-2xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-500/20 dark:text-rose-300 dark:hover:bg-rose-500/10"
          >
            Move to Hot
          </button>
          <button
            type="button"
            onClick={onMarkWon}
            className="inline-flex rounded-2xl border border-emerald-200 px-4 py-2.5 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50 dark:border-emerald-500/20 dark:text-emerald-300 dark:hover:bg-emerald-500/10"
          >
            Mark Won
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
          >
            Edit Lead
          </button>
        </div>

        <div className="mt-8 grid gap-6">
          <Card className="p-5">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-brand-500" />
              <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Timeline</h3>
            </div>
            <div className="mt-5 space-y-4">
              {lead.timeline.map((event) => (
                <div key={event.id} className="rounded-[1.3rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <div className="font-medium text-slate-950 dark:text-white">{event.title}</div>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{event.detail}</p>
                  <div className="mt-2 text-xs text-slate-400 dark:text-slate-500">{event.time}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-950 dark:text-white">AI Follow-Up</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Generate a personalized {followUpForm.channel.toLowerCase()} follow-up from this lead profile.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onGenerateFollowUp()
                  onSetShowFollowUpModal(true)
                }}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
              >
                Open Generator
              </button>
            </div>

            {followUpDraft ? (
              <div className="mt-5 rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                {followUpDraft.subject && (
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
                      Subject
                    </div>
                    <div className="mt-2 text-sm text-slate-700 dark:text-slate-300">{followUpDraft.subject}</div>
                  </div>
                )}
                <div className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
                  Message
                </div>
                <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-700 dark:text-slate-300">
                  {followUpDraft.body}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={async () => {
                      await navigator.clipboard.writeText(
                        [followUpDraft.subject, followUpDraft.body, followUpDraft.cta, followUpDraft.signature]
                          .filter(Boolean)
                          .join('\n\n'),
                      )
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </button>
                  <button
                    type="button"
                    onClick={onSaveFollowUpToTimeline}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Save to Timeline
                  </button>
                  <button
                    type="button"
                    onClick={onScheduleFollowUp}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
                  >
                    <CalendarClock className="h-3.5 w-3.5" />
                    Schedule Follow-Up
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-[1.4rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center dark:border-slate-800 dark:bg-slate-950">
                <div className="text-base font-semibold text-slate-900 dark:text-white">No AI message yet</div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Generate a lead-specific follow-up to save, copy, or send.
                </p>
              </div>
            )}
          </Card>

          <Card className="p-5">
            <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Lead Notes</h3>
            <div className="mt-5 space-y-4">
              {lead.notesHistory.length > 0 ? (
                lead.notesHistory.map((note) => (
                  <div key={note.id} className="rounded-[1.3rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                    <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">{note.text}</p>
                    <div className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                      {note.author} • {note.createdAt}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.3rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center dark:border-slate-800 dark:bg-slate-950">
                  <div className="text-sm text-slate-500 dark:text-slate-400">No saved notes yet.</div>
                </div>
              )}
            </div>
            <textarea
              rows="4"
              value={noteText}
              onChange={(event) => onSetNoteText(event.target.value)}
              placeholder="Add a note about this lead, objections, preferences, or context..."
              className="mt-5 w-full rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
            />
            <button
              type="button"
              onClick={onSaveNote}
              className="mt-4 inline-flex rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              Save Note
            </button>
          </Card>
        </div>
      </aside>
    </div>
  )
}

function Leads({
  leads = [],
  loading,
  onAddLead,
  onMarkAsContacted,
  onUpdateLead,
  workspace,
}) {
  const [localLeads, setLocalLeads] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sourceFilter, setSourceFilter] = useState('All')
  const [assignedFilter, setAssignedFilter] = useState('All')
  const [followUpFilter, setFollowUpFilter] = useState('All')
  const [viewMode, setViewMode] = useState('Table View')
  const [selectedLeadId, setSelectedLeadId] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showFollowUpModal, setShowFollowUpModal] = useState(false)
  const [leadForm, setLeadForm] = useState(defaultLeadForm)
  const [followUpForm, setFollowUpForm] = useState(defaultFollowUpForm)
  const [followUpDraft, setFollowUpDraft] = useState(null)
  const [noteText, setNoteText] = useState('')
  const [toasts, setToasts] = useState([])
  const [exportOpen, setExportOpen] = useState(false)
  const importRef = useRef(null)

  useEffect(() => {
    setLocalLeads((current) => {
      const map = new Map(current.map((lead) => [lead.id, lead]))
      return leads.map((lead) => normalizeLead(lead, map.get(lead.id)))
    })
  }, [leads])

  const pushToast = (message) => {
    const id = crypto.randomUUID()
    setToasts((current) => [...current, { id, message }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 2400)
  }

  const selectedLead = useMemo(
    () => localLeads.find((lead) => lead.id === selectedLeadId) || null,
    [localLeads, selectedLeadId],
  )

  const filteredLeads = useMemo(() => {
    return localLeads.filter((lead) => {
      if (lead.archived) return false
      const searchBlob = [
        lead.name,
        lead.email,
        lead.phone,
        lead.notes,
        lead.interest,
        lead.source,
      ]
        .join(' ')
        .toLowerCase()
      const searchMatch = searchValue.trim().length === 0 || searchBlob.includes(searchValue.toLowerCase())
      const statusMatch = statusFilter === 'All' || lead.status === statusFilter
      const sourceMatch = sourceFilter === 'All' || lead.source === sourceFilter
      const assignedMatch = assignedFilter === 'All' || lead.assignedTo === assignedFilter
      const followUpTime = parseDateKey(lead.followUpDate)
      const todayTime = parseDateKey(todayKey)
      const followMatch =
        followUpFilter === 'All' ||
        (followUpFilter === 'Due Today' && followUpTime === todayTime) ||
        (followUpFilter === 'Overdue' && followUpTime && followUpTime < todayTime) ||
        (followUpFilter === 'Upcoming' && followUpTime && followUpTime > todayTime)
      return searchMatch && statusMatch && sourceMatch && assignedMatch && followMatch
    })
  }, [assignedFilter, followUpFilter, localLeads, searchValue, sourceFilter, statusFilter])

  const followUpsDue = useMemo(() => {
    const todayTime = parseDateKey(todayKey)
    return filteredLeads.filter((lead) => {
      const followUpTime = parseDateKey(lead.followUpDate)
      return followUpTime && followUpTime <= todayTime && lead.status !== 'Won' && lead.status !== 'Lost'
    })
  }, [filteredLeads])

  const stats = useMemo(() => {
    const visible = filteredLeads
    const pipelineValue = visible.reduce((sum, lead) => sum + Number(lead.estimatedValue || 0), 0)
    return [
      { label: 'Total Leads', value: `${visible.length}`, detail: 'Visible leads in the current CRM view' },
      { label: 'New Leads', value: `${visible.filter((lead) => lead.status === 'New').length}`, detail: 'Waiting for first contact' },
      { label: 'Hot Leads', value: `${visible.filter((lead) => lead.status === 'Hot').length}`, detail: 'High-intent conversations right now' },
      { label: 'Won Deals', value: `${visible.filter((lead) => lead.status === 'Won').length}`, detail: 'Closed and moved into booked work' },
      { label: 'Follow-Ups Due', value: `${followUpsDue.length}`, detail: 'Due today or overdue' },
      { label: 'Estimated Pipeline Value', value: formatCurrency(pipelineValue), detail: 'Based on filtered visible leads' },
    ]
  }, [filteredLeads, followUpsDue.length])

  const updateLeadLocally = (leadId, updater) => {
    setLocalLeads((current) =>
      current.map((lead) => (lead.id === leadId ? { ...lead, ...updater(lead) } : lead)),
    )
  }

  const syncCoreLead = async (leadId, payload) => {
    await onUpdateLead?.(leadId, payload)
  }

  const handleAddLead = async () => {
    const payload = {
      email: leadForm.email,
      last_contact: 'Not contacted',
      name: leadForm.fullName,
      next_step: leadForm.nextStep,
      note: leadForm.leadNotes,
      phone: leadForm.phone,
      source: leadForm.source,
      status: leadForm.status,
    }
    const savedLead = (await onAddLead?.(payload)) || {
      id: crypto.randomUUID(),
      ...payload,
    }
    const nextLead = normalizeLead(
      {
        email: savedLead.email,
        id: savedLead.id,
        last_contact: savedLead.last_contact,
        name: savedLead.name,
        next_step: savedLead.next_step,
        note: savedLead.note,
        phone: savedLead.phone,
        source: savedLead.source,
        status: savedLead.status,
      },
      {
        assignedTo: leadForm.assignedTo,
        estimatedValue: leadForm.estimatedValue,
        followUpDate: leadForm.followUpDate,
        interest: leadForm.interest,
        nextStep: leadForm.nextStep,
        notes: leadForm.leadNotes,
        preferredContactMethod: leadForm.preferredContactMethod,
        timeline: [
          {
            detail: `${leadForm.fullName} was added from ${leadForm.source}.`,
            id: crypto.randomUUID(),
            time: new Date().toLocaleString(),
            title: 'Lead created',
          },
          {
            detail: `Follow-up scheduled for ${leadForm.followUpDate || 'a later date'}.`,
            id: crypto.randomUUID(),
            time: new Date().toLocaleString(),
            title: 'Follow-up scheduled',
          },
        ],
      },
    )
    setLocalLeads((current) => [nextLead, ...current.filter((lead) => lead.id !== nextLead.id)])
    setLeadForm(defaultLeadForm)
    setShowAddModal(false)
    pushToast('Lead added successfully.')
  }

  const handleOpenEdit = () => {
    if (!selectedLead) return
    setLeadForm({
      assignedTo: selectedLead.assignedTo,
      email: selectedLead.email,
      estimatedValue: selectedLead.estimatedValue,
      followUpDate: selectedLead.followUpDate,
      fullName: selectedLead.name,
      interest: selectedLead.interest,
      leadNotes: selectedLead.notes,
      nextStep: selectedLead.nextStep,
      phone: selectedLead.phone,
      preferredContactMethod: selectedLead.preferredContactMethod,
      source: selectedLead.source,
      status: selectedLead.status,
    })
    setShowEditModal(true)
  }

  const handleSaveEdit = async () => {
    if (!selectedLead) return
    await syncCoreLead(selectedLead.id, {
      email: leadForm.email,
      last_contact: selectedLead.lastContact,
      name: leadForm.fullName,
      next_step: leadForm.nextStep,
      note: leadForm.leadNotes,
      phone: leadForm.phone,
      source: leadForm.source,
      status: leadForm.status,
    })
    updateLeadLocally(selectedLead.id, () => ({
      assignedTo: leadForm.assignedTo,
      email: leadForm.email,
      estimatedValue: leadForm.estimatedValue,
      followUpDate: leadForm.followUpDate,
      interest: leadForm.interest,
      lastContact: selectedLead.lastContact,
      name: leadForm.fullName,
      nextStep: leadForm.nextStep,
      notes: leadForm.leadNotes,
      preferredContactMethod: leadForm.preferredContactMethod,
      phone: leadForm.phone,
      source: leadForm.source,
      status: leadForm.status,
      timeline: [
        {
          detail: 'Lead profile fields were updated.',
          id: crypto.randomUUID(),
          time: new Date().toLocaleString(),
          title: 'Lead updated',
        },
        ...selectedLead.timeline,
      ],
    }))
    setShowEditModal(false)
    pushToast('Lead updated.')
  }

  const handleDuplicateLead = async (lead) => {
    const payload = {
      email: lead.email,
      last_contact: lead.lastContact,
      name: `${lead.name} Copy`,
      next_step: lead.nextStep,
      note: lead.notes,
      phone: lead.phone,
      source: lead.source,
      status: 'New',
    }
    const savedLead = (await onAddLead?.(payload)) || { id: crypto.randomUUID(), ...payload }
    const duplicateLead = normalizeLead(
      {
        email: savedLead.email,
        id: savedLead.id,
        last_contact: savedLead.last_contact,
        name: savedLead.name,
        next_step: savedLead.next_step,
        note: savedLead.note,
        phone: savedLead.phone,
        source: savedLead.source,
        status: savedLead.status,
      },
      {
        assignedTo: lead.assignedTo,
        estimatedValue: lead.estimatedValue,
        followUpDate: lead.followUpDate,
        interest: lead.interest,
        notes: lead.notes,
        preferredContactMethod: lead.preferredContactMethod,
        timeline: [
          {
            detail: `Duplicated from ${lead.name}.`,
            id: crypto.randomUUID(),
            time: new Date().toLocaleString(),
            title: 'Lead duplicated',
          },
        ],
      },
    )
    setLocalLeads((current) => [duplicateLead, ...current])
    pushToast('Lead duplicated.')
  }

  const handleArchiveLead = (leadId) => {
    updateLeadLocally(leadId, () => ({ archived: true }))
    pushToast('Lead archived.')
  }

  const handleDeleteLead = (leadId) => {
    setLocalLeads((current) => current.filter((lead) => lead.id !== leadId))
    if (selectedLeadId === leadId) setSelectedLeadId(null)
    pushToast('Lead deleted.')
  }

  const handleMoveLeadStage = async (leadId, status) => {
    await syncCoreLead(leadId, { status })
    updateLeadLocally(leadId, (lead) => ({
      status,
      timeline: [
        {
          detail: `Lead moved to ${status}.`,
          id: crypto.randomUUID(),
          time: new Date().toLocaleString(),
          title: 'Status changed',
        },
        ...lead.timeline,
      ],
    }))
  }

  const handleGenerateFollowUp = (lead = selectedLead) => {
    if (!lead) return
    const nextDraft = buildFollowUpMessage({
      businessType: workspace?.business_type || 'Auto Detailing',
      channel: followUpForm.channel,
      context: followUpForm.context,
      goal: followUpForm.goal,
      lead,
      tone: followUpForm.tone,
    })
    setFollowUpDraft(nextDraft)
    pushToast('Generated draft.')
  }

  const handleSaveFollowUpTimeline = () => {
    if (!selectedLead || !followUpDraft) return
    updateLeadLocally(selectedLead.id, (lead) => ({
      timeline: [
        {
          detail: followUpDraft.body,
          id: crypto.randomUUID(),
          time: new Date().toLocaleString(),
          title: `${followUpDraft.channel} follow-up saved`,
        },
        ...lead.timeline,
      ],
    }))
    pushToast('Follow-up saved to timeline.')
  }

  const sendThroughIntegration = async (lead, channel, body, subject = '') => {
    if (channel === 'Email') {
      const emailState = getStoredMockIntegration('email-sending')
      if (!emailState || emailState.status !== 'Connected') {
        pushToast('Connect Email or SMS in Integrations to send directly.')
        return false
      }
      await sendMockEmail({
        body,
        recipientEmail: lead.email,
        recipientName: lead.name,
        subject: subject || `Follow-up for ${lead.name}`,
      })
      updateLeadLocally(lead.id, (current) => ({
        lastContact: 'Just now',
        timeline: [
          {
            detail: subject ? `${subject} sent via Email.` : 'Message sent via Email.',
            id: crypto.randomUUID(),
            time: new Date().toLocaleString(),
            title: 'Message sent',
          },
          ...current.timeline,
        ],
      }))
      pushToast('Message sent.')
      return true
    }

    const smsState = getStoredMockIntegration('phone-sms')
    if (!smsState || smsState.status !== 'Connected') {
      pushToast('Connect Email or SMS in Integrations to send directly.')
      return false
    }
    await sendMockSms({
      message: body,
      recipientName: lead.name,
      recipientPhone: lead.phone,
    })
    updateLeadLocally(lead.id, (current) => ({
      lastContact: 'Just now',
      timeline: [
        {
          detail: 'Message sent via SMS.',
          id: crypto.randomUUID(),
          time: new Date().toLocaleString(),
          title: 'Message sent',
        },
        ...current.timeline,
      ],
    }))
    pushToast('Message sent.')
    return true
  }

  const handleMarkContacted = async (leadId) => {
    await onMarkAsContacted?.(leadId)
    updateLeadLocally(leadId, (lead) => ({
      lastContact: 'Just now',
      nextStep: 'Send proposal',
      status: 'Contacted',
      timeline: [
        {
          detail: 'Lead marked as contacted and moved forward in the pipeline.',
          id: crypto.randomUUID(),
          time: new Date().toLocaleString(),
          title: 'Status changed',
        },
        ...lead.timeline,
      ],
    }))
  }

  const handleSaveNote = () => {
    if (!selectedLead || !noteText.trim()) return
    updateLeadLocally(selectedLead.id, (lead) => ({
      notes: noteText.trim(),
      notesHistory: [
        {
          author: 'Josh Salinas',
          createdAt: new Date().toLocaleString(),
          id: crypto.randomUUID(),
          text: noteText.trim(),
        },
        ...lead.notesHistory,
      ],
      timeline: [
        {
          detail: noteText.trim(),
          id: crypto.randomUUID(),
          time: new Date().toLocaleString(),
          title: 'Note added',
        },
        ...lead.timeline,
      ],
    }))
    setNoteText('')
    pushToast('Note saved.')
  }

  const exportRows = useMemo(
    () =>
      filteredLeads.map((lead) => ({
        'Assigned To': lead.assignedTo,
        Email: lead.email,
        'Estimated Value': lead.estimatedValue,
        Interest: lead.interest,
        'Last Contact': lead.lastContact,
        Name: lead.name,
        'Next Step': lead.nextStep,
        Notes: lead.notes,
        Phone: lead.phone,
        Source: lead.source,
        Status: lead.status,
      })),
    [filteredLeads],
  )

  const handleExport = (type) => {
    if (type === 'csv') {
      const headers = Object.keys(exportRows[0] || {
        Name: '',
        Email: '',
        Phone: '',
        Source: '',
        Status: '',
        Interest: '',
        'Estimated Value': '',
        'Last Contact': '',
        'Next Step': '',
        'Assigned To': '',
        Notes: '',
      })
      const csv = [
        headers.join(','),
        ...exportRows.map((row) =>
          headers
            .map((header) => `"${String(row[header] ?? '').replaceAll('"', '""')}"`)
            .join(','),
        ),
      ].join('\n')
      formatDownload('commandly-leads.csv', csv, 'text/csv;charset=utf-8;')
      pushToast('Leads exported.')
      return
    }

    if (type === 'json') {
      formatDownload('commandly-leads.json', JSON.stringify(exportRows, null, 2), 'application/json')
      pushToast('Leads exported.')
      return
    }

    const printWindow = window.open('', '_blank', 'width=1100,height=800')
    if (!printWindow) {
      pushToast('Popup blocked. Allow popups to export PDF.')
      return
    }
    printWindow.document.write(`
      <html>
        <head>
          <title>Commandly AI Leads Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; color: #0f172a; }
            h1 { margin-bottom: 8px; }
            p { color: #475569; }
            table { width: 100%; border-collapse: collapse; margin-top: 24px; }
            th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-size: 12px; }
            th { background: #f8fafc; }
            .section { margin-top: 28px; }
          </style>
        </head>
        <body>
          <h1>Commandly AI Leads Report</h1>
          <p>Business name: ${workspace?.business_name || 'Commandly AI'}<br/>Export date: ${new Date().toLocaleString()}</p>
          <div class="section">
            <strong>Summary</strong>
            <p>Total Leads: ${stats[0].value} • New Leads: ${stats[1].value} • Hot Leads: ${stats[2].value} • Won Deals: ${stats[3].value} • Follow-Ups Due: ${stats[4].value} • Estimated Pipeline Value: ${stats[5].value}</p>
          </div>
          <div class="section">
            <strong>Lead Table</strong>
            <table>
              <thead>
                <tr>${Object.keys(exportRows[0] || {}).map((key) => `<th>${key}</th>`).join('')}</tr>
              </thead>
              <tbody>
                ${exportRows
                  .map(
                    (row) =>
                      `<tr>${Object.values(row)
                        .map((value) => `<td>${value ?? ''}</td>`)
                        .join('')}</tr>`,
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
          <div class="section">
            <strong>Follow-Ups Due</strong>
            <p>${followUpsDue
              .map((lead) => `${lead.name} — ${lead.nextStep} — ${lead.followUpDate || 'No due date'}`)
              .join('<br/>')}</p>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    pushToast('Leads exported.')
  }

  const handleImportCsv = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const text = await file.text()
    const [headerLine, ...rows] = text.split(/\r?\n/).filter(Boolean)
    const headers = headerLine.split(',').map((header) => header.trim().toLowerCase())

    // TODO: Replace with a more robust CSV parser if quoted commas and multiline cells become common.
    const imported = rows.map((row) => {
      const values = row.split(',').map((item) => item.trim())
      const record = Object.fromEntries(headers.map((header, index) => [header, values[index] || '']))
      return normalizeLead(
        {
          email: record.email,
          id: crypto.randomUUID(),
          last_contact: record.last_contact || 'Not contacted',
          name: record.name || 'Imported Lead',
          next_step: record.next_step || 'Review imported lead',
          note: record.notes || '',
          phone: record.phone || '',
          source: record.source || 'Manual',
          status: record.status || 'New',
        },
        {
          notes: record.notes || '',
        },
      )
    })
    setLocalLeads((current) => [...imported, ...current])
    event.target.value = ''
    pushToast(`${imported.length} leads imported.`)
  }

  const handleLoadDemoLeads = () => {
    setLocalLeads((current) => {
      const existingIds = new Set(current.map((lead) => lead.id))
      const next = demoLeads
        .filter((lead) => !existingIds.has(lead.id))
        .map((lead) =>
          normalizeLead(
            {
              email: lead.email,
              id: lead.id,
              last_contact: lead.lastContact,
              name: lead.name,
              next_step: lead.nextStep,
              note: lead.notes,
              phone: lead.phone,
              source: lead.source,
              status: lead.status,
            },
            lead,
          ),
        )
      return [...next, ...current]
    })
    pushToast('Demo leads loaded.')
  }

  const assignedOptions = useMemo(() => ['All', ...new Set([...assignedPeople, ...localLeads.map((lead) => lead.assignedTo)])], [localLeads])

  return (
    <>
      <ToastStack toasts={toasts} />

      <div className="grid gap-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Leads</h1>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
              Track every opportunity, personalize follow-ups, and turn inbound interest into booked work.
            </p>
          </div>
          <div className="grid gap-3 lg:grid-cols-3 xl:grid-cols-6">
            <label className="relative xl:col-span-2">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search leads"
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-brand-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>
            <Dropdown
              items={statusOptions.map((item) => ({ id: item, label: item }))}
              label={statusFilter}
              onSelect={(item) => setStatusFilter(item.label)}
              className="w-full"
              triggerClassName="w-full justify-between"
            />
            <Dropdown
              items={sourceOptions.map((item) => ({ id: item, label: item }))}
              label={sourceFilter}
              onSelect={(item) => setSourceFilter(item.label)}
              className="w-full"
              triggerClassName="w-full justify-between"
            />
            <Dropdown
              items={[
                { id: 'csv', label: 'Export CSV' },
                { id: 'pdf', label: 'Export PDF' },
                { id: 'json', label: 'Export JSON' },
              ]}
              label="Export"
              onSelect={(item) => handleExport(item.id)}
              className="w-full"
              triggerClassName="w-full justify-between"
            />
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              <UserRoundPlus className="h-4 w-4" />
              Add Lead
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Dropdown
            items={viewOptions.map((item) => ({ id: item, label: item }))}
            label={viewMode}
            onSelect={(item) => setViewMode(item.label)}
          />
          <Dropdown
            items={assignedOptions.map((item) => ({ id: item, label: item }))}
            label={assignedFilter}
            onSelect={(item) => setAssignedFilter(item.label)}
          />
          <Dropdown
            items={followUpFilterOptions.map((item) => ({ id: item, label: item }))}
            label={followUpFilter}
            onSelect={(item) => setFollowUpFilter(item.label)}
          />
          <button
            type="button"
            onClick={() => importRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
          >
            <Upload className="h-4 w-4" />
            Import CSV
          </button>
          <button
            type="button"
            onClick={handleLoadDemoLeads}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
          >
            <Sparkles className="h-4 w-4" />
            Load Demo Leads
          </button>
          <input ref={importRef} type="file" accept=".csv" onChange={handleImportCsv} className="hidden" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {stats.map((item) => (
            <StatCard key={item.label} label={item.label} value={item.value} detail={item.detail} />
          ))}
        </div>

        <Card>
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-brand-500" />
            <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Follow-Ups Due</h3>
          </div>
          {followUpsDue.length > 0 ? (
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {followUpsDue.map((lead) => (
                <div key={lead.id} className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium text-slate-950 dark:text-white">{lead.name}</div>
                      <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Due {lead.followUpDate} • {lead.nextStep}
                      </div>
                    </div>
                    <Badge>{lead.status}</Badge>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedLeadId(lead.id)
                        handleGenerateFollowUp(lead)
                        setShowFollowUpModal(true)
                      }}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
                    >
                      <WandSparkles className="h-3.5 w-3.5" />
                      Generate Follow-Up
                    </button>
                    <button
                      type="button"
                      onClick={() => updateLeadLocally(lead.id, () => ({ followUpDate: '', nextStep: 'Completed' }))}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Mark Done
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-[1.4rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center dark:border-slate-800 dark:bg-slate-950">
              <div className="text-base font-semibold text-slate-900 dark:text-white">No follow-ups due</div>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Leads with today or overdue follow-up dates will show up here.
              </p>
            </div>
          )}
        </Card>

        {viewMode === 'Table View' ? (
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="min-w-[1450px] w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-950">
                  <tr>
                    {[
                      'Lead Name',
                      'Email',
                      'Phone',
                      'Source',
                      'Status',
                      'Interest',
                      'Estimated Value',
                      'Last Contact',
                      'Next Step',
                      'Assigned To',
                      'Actions',
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="11" className="px-6 py-12 text-center">
                        <LoaderCircle className="mx-auto h-6 w-6 animate-spin text-slate-400" />
                      </td>
                    </tr>
                  ) : filteredLeads.length > 0 ? (
                    filteredLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="border-t border-slate-100 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950/70"
                      >
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() => setSelectedLeadId(lead.id)}
                            className="text-left"
                          >
                            <div className="font-medium text-slate-900 dark:text-white">{lead.name}</div>
                            <div className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                              {lead.preferredContactMethod} preferred
                            </div>
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{lead.email}</td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{lead.phone}</td>
                        <td className="px-6 py-4"><Badge tone="source">{lead.source}</Badge></td>
                        <td className="px-6 py-4"><Badge>{lead.status}</Badge></td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{lead.interest}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{formatCurrency(lead.estimatedValue)}</td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{lead.lastContact}</td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{lead.nextStep}</td>
                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{lead.assignedTo}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedLeadId(lead.id)}
                              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
                            >
                              View
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedLeadId(lead.id)
                                handleGenerateFollowUp(lead)
                                setShowFollowUpModal(true)
                              }}
                              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
                            >
                              Generate Follow-Up
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMarkContacted(lead.id)}
                              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
                            >
                              Mark Contacted
                            </button>
                            <Dropdown
                              items={[
                                { id: 'edit', label: 'Edit' },
                                { id: 'duplicate', label: 'Duplicate' },
                                { id: 'archive', label: 'Archive' },
                                { id: 'delete', label: 'Delete' },
                              ]}
                              label="More"
                              onSelect={(item) => {
                                if (item.id === 'edit') {
                                  setSelectedLeadId(lead.id)
                                  setTimeout(handleOpenEdit, 0)
                                } else if (item.id === 'duplicate') {
                                  handleDuplicateLead(lead)
                                } else if (item.id === 'archive') {
                                  handleArchiveLead(lead.id)
                                } else {
                                  handleDeleteLead(lead.id)
                                }
                              }}
                              showChevron={false}
                              triggerClassName="rounded-full px-3 py-1.5 text-xs font-semibold"
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" className="px-6 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                        No leads yet. Add your first lead or load demo data to test the CRM flow.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 xl:grid-cols-3 2xl:grid-cols-6">
            {statusOptions
              .filter((item) => item !== 'All')
              .map((status) => (
                <Card key={status} className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-semibold text-slate-950 dark:text-white">{status}</div>
                    <Badge>{status}</Badge>
                  </div>
                  <div className="mt-4 space-y-3">
                    {filteredLeads
                      .filter((lead) => lead.status === status)
                      .map((lead) => (
                        <div key={lead.id} className="rounded-[1.3rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                          <div className="font-medium text-slate-950 dark:text-white">{lead.name}</div>
                          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                            {lead.source} • {formatCurrency(lead.estimatedValue)}
                          </div>
                          <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">{lead.nextStep}</div>
                          <div className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                            Follow-up {lead.followUpDate || 'not set'}
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedLeadId(lead.id)}
                              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
                            >
                              View
                            </button>
                            {status !== 'Won' && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleMoveLeadStage(
                                    lead.id,
                                    status === 'New'
                                      ? 'Contacted'
                                      : status === 'Contacted'
                                        ? 'Hot'
                                        : status === 'Hot'
                                          ? 'Proposal Sent'
                                          : status === 'Proposal Sent'
                                            ? 'Won'
                                            : status,
                                  )
                                }
                                className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
                              >
                                Move Forward
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </Card>
              ))}
          </div>
        )}
      </div>

      <LeadDrawer
        businessType={workspace?.business_type}
        followUpDraft={followUpDraft}
        followUpForm={followUpForm}
        lead={selectedLead}
        noteText={noteText}
        onChangeFollowUpForm={setFollowUpForm}
        onClose={() => setSelectedLeadId(null)}
        onEdit={handleOpenEdit}
        onGenerateFollowUp={() => handleGenerateFollowUp(selectedLead)}
        onMarkAsContacted={() => selectedLead && handleMarkContacted(selectedLead.id)}
        onMoveToHot={() => selectedLead && handleMoveLeadStage(selectedLead.id, 'Hot')}
        onMarkWon={() => selectedLead && handleMoveLeadStage(selectedLead.id, 'Won')}
        onSaveFollowUpToTimeline={handleSaveFollowUpTimeline}
        onSendEmail={() =>
          selectedLead &&
          sendThroughIntegration(
            selectedLead,
            'Email',
            followUpDraft?.body || `Hi ${selectedLead.name}, just following up on your request.`,
            followUpDraft?.subject,
          )
        }
        onSendSms={() =>
          selectedLead &&
          sendThroughIntegration(
            selectedLead,
            'SMS',
            followUpDraft?.channel === 'SMS'
              ? followUpDraft.body
              : `Hi ${selectedLead.name.split(' ')[0]}, just following up on your request.`,
          )
        }
        onScheduleFollowUp={() => {
          if (!selectedLead) return
          updateLeadLocally(selectedLead.id, (lead) => ({
            followUpDate: todayKey,
            timeline: [
              {
                detail: 'A follow-up reminder was scheduled for today.',
                id: crypto.randomUUID(),
                time: new Date().toLocaleString(),
                title: 'Follow-up scheduled',
              },
              ...lead.timeline,
            ],
          }))
          pushToast('Follow-up scheduled.')
        }}
        onSaveNote={handleSaveNote}
        onSetNoteText={setNoteText}
        onSetShowFollowUpModal={setShowFollowUpModal}
      />

      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)} title="Add Lead">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 sm:col-span-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Full Name</span>
              <input
                type="text"
                value={leadForm.fullName}
                onChange={(event) => setLeadForm((current) => ({ ...current, fullName: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Email</span>
              <input
                type="email"
                value={leadForm.email}
                onChange={(event) => setLeadForm((current) => ({ ...current, email: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Phone</span>
              <input
                type="text"
                value={leadForm.phone}
                onChange={(event) => setLeadForm((current) => ({ ...current, phone: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>
            <div className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Source</span>
              <Dropdown
                items={sourceOptions.filter((item) => item !== 'All').map((item) => ({ id: item, label: item }))}
                label={leadForm.source}
                onSelect={(item) => setLeadForm((current) => ({ ...current, source: item.label }))}
                className="w-full"
                triggerClassName="w-full justify-between"
              />
            </div>
            <div className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Status</span>
              <Dropdown
                items={statusOptions.filter((item) => item !== 'All').map((item) => ({ id: item, label: item }))}
                label={leadForm.status}
                onSelect={(item) => setLeadForm((current) => ({ ...current, status: item.label }))}
                className="w-full"
                triggerClassName="w-full justify-between"
              />
            </div>
            <div className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Interest</span>
              <Dropdown
                items={interestOptions.map((item) => ({ id: item, label: item }))}
                label={leadForm.interest}
                onSelect={(item) => setLeadForm((current) => ({ ...current, interest: item.label }))}
                className="w-full"
                triggerClassName="w-full justify-between"
              />
            </div>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Estimated Value</span>
              <input
                type="number"
                value={leadForm.estimatedValue}
                onChange={(event) => setLeadForm((current) => ({ ...current, estimatedValue: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>
            <label className="grid gap-2 sm:col-span-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Lead Notes</span>
              <textarea
                rows="4"
                value={leadForm.leadNotes}
                onChange={(event) => setLeadForm((current) => ({ ...current, leadNotes: event.target.value }))}
                className="w-full rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>
            <div className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Preferred Contact Method</span>
              <Dropdown
                items={contactMethodOptions.map((item) => ({ id: item, label: item }))}
                label={leadForm.preferredContactMethod}
                onSelect={(item) => setLeadForm((current) => ({ ...current, preferredContactMethod: item.label }))}
                className="w-full"
                triggerClassName="w-full justify-between"
              />
            </div>
            <div className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Assigned To</span>
              <Dropdown
                items={assignedPeople.map((item) => ({ id: item, label: item }))}
                label={leadForm.assignedTo}
                onSelect={(item) => setLeadForm((current) => ({ ...current, assignedTo: item.label }))}
                className="w-full"
                triggerClassName="w-full justify-between"
              />
            </div>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Next Step</span>
              <input
                type="text"
                value={leadForm.nextStep}
                onChange={(event) => setLeadForm((current) => ({ ...current, nextStep: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Follow-Up Date</span>
              <input
                type="date"
                value={leadForm.followUpDate}
                onChange={(event) => setLeadForm((current) => ({ ...current, followUpDate: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="inline-flex rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddLead}
              className="inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              Add Lead
            </button>
          </div>
        </Modal>
      )}

      {showEditModal && selectedLead && (
        <Modal onClose={() => setShowEditModal(false)} title="Edit Lead">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 sm:col-span-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Name</span>
              <input
                type="text"
                value={leadForm.fullName}
                onChange={(event) => setLeadForm((current) => ({ ...current, fullName: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Email</span>
              <input
                type="email"
                value={leadForm.email}
                onChange={(event) => setLeadForm((current) => ({ ...current, email: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Phone</span>
              <input
                type="text"
                value={leadForm.phone}
                onChange={(event) => setLeadForm((current) => ({ ...current, phone: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>
            <div className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Source</span>
              <Dropdown
                items={sourceOptions.filter((item) => item !== 'All').map((item) => ({ id: item, label: item }))}
                label={leadForm.source}
                onSelect={(item) => setLeadForm((current) => ({ ...current, source: item.label }))}
                className="w-full"
                triggerClassName="w-full justify-between"
              />
            </div>
            <div className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Status</span>
              <Dropdown
                items={statusOptions.filter((item) => item !== 'All').map((item) => ({ id: item, label: item }))}
                label={leadForm.status}
                onSelect={(item) => setLeadForm((current) => ({ ...current, status: item.label }))}
                className="w-full"
                triggerClassName="w-full justify-between"
              />
            </div>
            <div className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Interest</span>
              <Dropdown
                items={interestOptions.map((item) => ({ id: item, label: item }))}
                label={leadForm.interest}
                onSelect={(item) => setLeadForm((current) => ({ ...current, interest: item.label }))}
                className="w-full"
                triggerClassName="w-full justify-between"
              />
            </div>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Estimated Value</span>
              <input
                type="number"
                value={leadForm.estimatedValue}
                onChange={(event) => setLeadForm((current) => ({ ...current, estimatedValue: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>
            <div className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Preferred Contact Method</span>
              <Dropdown
                items={contactMethodOptions.map((item) => ({ id: item, label: item }))}
                label={leadForm.preferredContactMethod}
                onSelect={(item) => setLeadForm((current) => ({ ...current, preferredContactMethod: item.label }))}
                className="w-full"
                triggerClassName="w-full justify-between"
              />
            </div>
            <div className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Assigned To</span>
              <Dropdown
                items={assignedPeople.map((item) => ({ id: item, label: item }))}
                label={leadForm.assignedTo}
                onSelect={(item) => setLeadForm((current) => ({ ...current, assignedTo: item.label }))}
                className="w-full"
                triggerClassName="w-full justify-between"
              />
            </div>
            <label className="grid gap-2 sm:col-span-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Notes</span>
              <textarea
                rows="4"
                value={leadForm.leadNotes}
                onChange={(event) => setLeadForm((current) => ({ ...current, leadNotes: event.target.value }))}
                className="w-full rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Next Step</span>
              <input
                type="text"
                value={leadForm.nextStep}
                onChange={(event) => setLeadForm((current) => ({ ...current, nextStep: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Follow-Up Date</span>
              <input
                type="date"
                value={leadForm.followUpDate}
                onChange={(event) => setLeadForm((current) => ({ ...current, followUpDate: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={handleSaveEdit}
            className="mt-6 inline-flex rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            Save Changes
          </button>
        </Modal>
      )}

      {showFollowUpModal && selectedLead && (
        <Modal onClose={() => setShowFollowUpModal(false)} title="Generate Follow-Up">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Tone</span>
              <Dropdown
                items={followUpToneOptions.map((item) => ({ id: item, label: item }))}
                label={followUpForm.tone}
                onSelect={(item) => setFollowUpForm((current) => ({ ...current, tone: item.label }))}
                className="w-full"
                triggerClassName="w-full justify-between"
              />
            </div>
            <div className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Channel</span>
              <Dropdown
                items={followUpChannelOptions.map((item) => ({ id: item, label: item }))}
                label={followUpForm.channel}
                onSelect={(item) => setFollowUpForm((current) => ({ ...current, channel: item.label }))}
                className="w-full"
                triggerClassName="w-full justify-between"
              />
            </div>
            <div className="grid gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Goal</span>
              <Dropdown
                items={followUpGoalOptions.map((item) => ({ id: item, label: item }))}
                label={followUpForm.goal}
                onSelect={(item) => setFollowUpForm((current) => ({ ...current, goal: item.label }))}
                className="w-full"
                triggerClassName="w-full justify-between"
              />
            </div>
            <label className="grid gap-2 sm:col-span-3">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Optional Context</span>
              <textarea
                rows="4"
                value={followUpForm.context}
                onChange={(event) => setFollowUpForm((current) => ({ ...current, context: event.target.value }))}
                placeholder="They asked about premium detailing pricing."
                className="w-full rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => handleGenerateFollowUp(selectedLead)}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              <WandSparkles className="h-4 w-4" />
              Generate
            </button>
            <button
              type="button"
              onClick={async () => {
                if (!followUpDraft) return
                await navigator.clipboard.writeText(
                  [followUpDraft.subject, followUpDraft.body, followUpDraft.cta, followUpDraft.signature]
                    .filter(Boolean)
                    .join('\n\n'),
                )
                pushToast('Copied to clipboard.')
              }}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
            >
              <Copy className="h-4 w-4" />
              Copy
            </button>
            <button
              type="button"
              onClick={handleSaveFollowUpTimeline}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
            >
              <Check className="h-4 w-4" />
              Save to Lead Timeline
            </button>
            <button
              type="button"
              onClick={() => selectedLead && sendThroughIntegration(selectedLead, 'Email', followUpDraft?.body || '', followUpDraft?.subject)}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
            >
              <Mail className="h-4 w-4" />
              Send via Email
            </button>
            <button
              type="button"
              onClick={() => selectedLead && sendThroughIntegration(selectedLead, 'SMS', followUpDraft?.channel === 'SMS' ? followUpDraft.body : followUpDraft?.cta || '')}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
            >
              <MessageSquareText className="h-4 w-4" />
              Send via SMS
            </button>
            <button
              type="button"
              onClick={() => {
                updateLeadLocally(selectedLead.id, (lead) => ({
                  followUpDate: todayKey,
                  timeline: [
                    {
                      detail: 'Follow-up reminder scheduled from the AI generator.',
                      id: crypto.randomUUID(),
                      time: new Date().toLocaleString(),
                      title: 'Follow-up scheduled',
                    },
                    ...lead.timeline,
                  ],
                }))
                pushToast('Follow-up scheduled.')
              }}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:text-white"
            >
              <CalendarClock className="h-4 w-4" />
              Schedule Follow-Up
            </button>
          </div>

          {followUpDraft && (
            <Card className="mt-6 p-5">
              {followUpDraft.subject && (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
                    Subject Line
                  </div>
                  <div className="mt-2 text-sm text-slate-700 dark:text-slate-300">{followUpDraft.subject}</div>
                </div>
              )}
              <div className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
                {followUpDraft.channel === 'Email' ? 'Email Body' : 'SMS Message'}
              </div>
              <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-700 dark:text-slate-300">
                {followUpDraft.body}
              </p>
              {followUpDraft.cta && (
                <>
                  <div className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
                    Call To Action
                  </div>
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{followUpDraft.cta}</p>
                </>
              )}
              {followUpDraft.signature && (
                <>
                  <div className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-300">
                    Signature
                  </div>
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{followUpDraft.signature}</p>
                </>
              )}
            </Card>
          )}
        </Modal>
      )}
    </>
  )
}

export default Leads
