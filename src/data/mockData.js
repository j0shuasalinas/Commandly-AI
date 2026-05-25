export const sidebarItems = [
  { label: 'Overview', path: '/dashboard', key: 'overview' },
  { label: 'AI Writer', path: '/dashboard/ai-writer', key: 'ai-writer' },
  { label: 'Reviews', path: '/dashboard/reviews', key: 'reviews' },
  { label: 'Campaigns', path: '/dashboard/campaigns', key: 'campaigns' },
  { label: 'Leads', path: '/dashboard/leads', key: 'leads' },
  { label: 'Analytics', path: '/dashboard/analytics', key: 'analytics' },
  { label: 'Automations', path: '/dashboard/automations', key: 'automations' },
  { label: 'Integrations', path: '/dashboard/integrations', key: 'integrations' },
  { label: 'Team', path: '/dashboard/team', key: 'team' },
  { label: 'Billing', path: '/dashboard/billing', key: 'billing' },
  { label: 'Settings', path: '/dashboard/settings', key: 'settings' },
]

export const overviewStats = [
  { label: 'AI Tasks Completed', value: 128, detail: '+12% vs yesterday' },
  { label: 'New Leads', value: 24, detail: '7 hot prospects ready' },
  { label: 'Reviews Replied', value: 36, detail: '92% handled in under 1 hour' },
  { label: 'Content Created', value: 18, detail: 'Posts, emails, and ads generated' },
]

export const overviewActivities = [
  {
    id: 'act-1',
    module: 'AI Writer',
    activity: 'Generated 5 ad variations for spring campaign',
    time: '2 min ago',
    status: 'Completed',
  },
  {
    id: 'act-2',
    module: 'Reviews',
    activity: 'Replied to new Google review from Amanda R.',
    time: '18 min ago',
    status: 'Approved',
  },
  {
    id: 'act-3',
    module: 'Leads',
    activity: 'Flagged 3 high-intent contacts for follow-up',
    time: '42 min ago',
    status: 'New',
  },
  {
    id: 'act-4',
    module: 'Analytics',
    activity: 'Weekly insight summary prepared for owner',
    time: '1 hr ago',
    status: 'Ready',
  },
]

export const contentIdeas = [
  'Behind-the-scenes reel featuring your detailing process',
  'Customer spotlight post with before-and-after transformation',
  'Limited-time referral campaign for returning clients',
]

export const customerMessages = [
  {
    id: 'msg-1',
    name: 'Avery Brooks',
    channel: 'Website lead',
    text: 'Interested in pricing for a monthly package. Can someone follow up this afternoon?',
  },
  {
    id: 'msg-2',
    name: 'Sofia Martinez',
    channel: 'Google review',
    text: 'Loved the service. Wish booking times were easier to see online.',
  },
]

export const reviews = [
  {
    id: 'rev-1',
    customer: 'Mia Chen',
    source: 'Google',
    rating: 5,
    status: 'New',
    date: 'May 21, 2026',
    sentiment: 'Positive',
    text: 'The team made our gym launch feel organized and premium. Great follow-up after our consultation.',
    reply:
      'Thank you, Mia. We loved helping your launch come together and appreciate the kind words about our follow-up process.',
  },
  {
    id: 'rev-2',
    customer: 'Jordan Patel',
    source: 'Facebook',
    rating: 4,
    status: 'Drafted',
    date: 'May 20, 2026',
    sentiment: 'Mixed',
    text: 'The haircut was great, but I had to wait longer than expected before my appointment started.',
    reply:
      'Thanks for sharing this, Jordan. We are glad you loved the haircut and appreciate the note about timing. We are already improving scheduling flow.',
  },
  {
    id: 'rev-3',
    customer: 'Camila Foster',
    source: 'Yelp',
    rating: 5,
    status: 'Approved',
    date: 'May 18, 2026',
    sentiment: 'Positive',
    text: 'Best detailing service in town. My car looked brand new and the pickup process was smooth.',
    reply:
      'Camila, thank you so much. We are thrilled the car felt brand new and that the pickup process was seamless for you.',
  },
  {
    id: 'rev-4',
    customer: 'Leo Bennett',
    source: 'Website',
    rating: 3,
    status: 'Published',
    date: 'May 17, 2026',
    sentiment: 'Neutral',
    text: 'The service was solid but I wanted more clarity on what was included in the package.',
    reply:
      'Thanks, Leo. We appreciate the honest feedback and are updating our package descriptions to make every option easier to understand.',
  },
]

export const reviewAnalytics = [
  { label: 'Average Rating', value: '4.7' },
  { label: 'Response Rate', value: '91%' },
  { label: 'New Reviews', value: '14' },
  { label: 'Sentiment Score', value: '82' },
]

export const campaigns = [
  {
    id: 'camp-1',
    name: 'Summer Detail Promo',
    channel: 'Social Media',
    status: 'Active',
    scheduledDate: 'May 28, 2026',
    performance: { reach: '14.2k', clicks: '382', conversions: '27' },
  },
  {
    id: 'camp-2',
    name: 'Loyalty Email Winback',
    channel: 'Email',
    status: 'Scheduled',
    scheduledDate: 'May 30, 2026',
    performance: { openRate: '44%', clicks: '96', conversions: '11' },
  },
  {
    id: 'camp-3',
    name: 'New Member Intro Offer',
    channel: 'SMS',
    status: 'Draft',
    scheduledDate: 'June 2, 2026',
    performance: { sends: '0', clicks: '0', conversions: '0' },
  },
  {
    id: 'camp-4',
    name: 'Google Local Lead Push',
    channel: 'Google Ads',
    status: 'Completed',
    scheduledDate: 'May 12, 2026',
    performance: { impressions: '24k', clicks: '611', conversions: '39' },
  },
]

export const upcomingCampaigns = [
  { day: 'Mon', label: 'Promo draft review', time: '10:00 AM' },
  { day: 'Tue', label: 'Email launch', time: '1:30 PM' },
  { day: 'Thu', label: 'SMS reminder blast', time: '9:00 AM' },
  { day: 'Fri', label: 'Google Ads refresh', time: '3:00 PM' },
]

export const leads = [
  {
    id: 'lead-1',
    name: 'Taylor Green',
    email: 'taylor@urbanfit.co',
    phone: '(555) 301-9942',
    source: 'Website',
    status: 'Hot',
    lastContact: '1 hour ago',
    nextStep: 'Send pricing proposal',
    note: 'Interested in a monthly content package and review automation.',
  },
  {
    id: 'lead-2',
    name: 'Nina Alvarez',
    email: 'nina@shopluxe.com',
    phone: '(555) 220-1147',
    source: 'Instagram',
    status: 'New',
    lastContact: 'Not contacted',
    nextStep: 'Generate first follow-up',
    note: 'Asked about help with Instagram captions and a launch promo.',
  },
  {
    id: 'lead-3',
    name: 'Marcus Lee',
    email: 'marcus@detaildrip.com',
    phone: '(555) 993-4411',
    source: 'Referral',
    status: 'Won',
    lastContact: 'Yesterday',
    nextStep: 'Kickoff onboarding',
    note: 'Ready to start with Pro plan after referral from another shop owner.',
  },
  {
    id: 'lead-4',
    name: 'Alicia Moore',
    email: 'alicia@harborrealty.com',
    phone: '(555) 883-9904',
    source: 'Google',
    status: 'Contacted',
    lastContact: '2 days ago',
    nextStep: 'Book strategy call',
    note: 'Needs help with listing promotions and lead follow-up reminders.',
  },
]

export const analyticsMetrics = [
  { label: 'AI Tasks', value: '412', detail: '+18%' },
  { label: 'Leads Captured', value: '96', detail: '+24%' },
  { label: 'Reviews Replied', value: '58', detail: '+11%' },
  { label: 'Campaign Engagement', value: '37%', detail: '+7%' },
  { label: 'Estimated Time Saved', value: '31 hrs', detail: 'This month' },
]

export const analyticsSeries = {
  leadGrowth: [8, 12, 14, 18, 21, 24, 29],
  sentimentTrend: [72, 76, 74, 79, 83, 82, 85],
  campaignPerformance: [18, 24, 20, 28, 32, 29, 36],
  aiUsage: [
    { label: 'Content', value: 41 },
    { label: 'Reviews', value: 22 },
    { label: 'Leads', value: 19 },
    { label: 'Insights', value: 18 },
  ],
}

export const analyticsInsights = [
  'Review replies are converting into follow-up bookings most consistently on weekdays before noon.',
  'Email campaign engagement is strongest when limited-time offers are paired with customer proof.',
  'Instagram-driven leads are warming up faster when an AI-generated follow-up is sent within 30 minutes.',
]

export const automations = [
  {
    id: 'auto-1',
    title: 'Auto-reply to new reviews',
    status: 'Active',
    enabled: true,
    description: 'Generate a branded reply whenever a new review arrives.',
  },
  {
    id: 'auto-2',
    title: 'Weekly social content plan',
    status: 'Paused',
    enabled: false,
    description: 'Build a weekly queue of content ideas based on trends and offers.',
  },
  {
    id: 'auto-3',
    title: 'Lead follow-up reminder',
    status: 'Active',
    enabled: true,
    description: 'Remind the team when hot leads have not been contacted fast enough.',
  },
  {
    id: 'auto-4',
    title: 'Dormant customer re-engagement',
    status: 'Needs Setup',
    enabled: false,
    description: 'Find inactive customers and prepare a comeback promotion sequence.',
  },
  {
    id: 'auto-5',
    title: 'Monthly performance report',
    status: 'Active',
    enabled: true,
    description: 'Deliver an AI summary of campaign, lead, and review performance.',
  },
]

export const automationWorkflows = [
  {
    id: 'wf-1',
    trigger: 'New Google review',
    action: 'Draft a polite branded response',
    approval: 'Manager approval',
    output: 'Publish to review source',
  },
  {
    id: 'wf-2',
    trigger: 'Friday at 9 AM',
    action: 'Generate next week\'s social plan',
    approval: 'Auto-send to content queue',
    output: 'Add to calendar board',
  },
]

export const integrations = [
  {
    id: 'int-1',
    name: 'Google Business Profile',
    description: 'Sync reviews, location insights, and profile activity.',
    status: 'Connected',
    action: 'Manage',
  },
  {
    id: 'int-2',
    name: 'Instagram',
    description: 'Schedule posts and track engagement from one place.',
    status: 'Connected',
    action: 'Manage',
  },
  {
    id: 'int-3',
    name: 'Facebook',
    description: 'Pull messages, comments, and local audience activity.',
    status: 'Not Connected',
    action: 'Connect',
  },
  {
    id: 'int-4',
    name: 'Gmail',
    description: 'Reply to inbound leads and campaign responses faster.',
    status: 'Connected',
    action: 'Manage',
  },
  {
    id: 'int-5',
    name: 'Stripe',
    description: 'Track customers, payments, and retention signals.',
    status: 'Not Connected',
    action: 'Connect',
  },
  {
    id: 'int-6',
    name: 'Google Analytics',
    description: 'Measure lead flow and site conversion trends.',
    status: 'Connected',
    action: 'Manage',
  },
  {
    id: 'int-7',
    name: 'Website Forms',
    description: 'Send new website inquiries straight into leads.',
    status: 'Connected',
    action: 'Manage',
  },
  {
    id: 'int-8',
    name: 'Zapier',
    description: 'Extend Commandly AI into other workflows and tools.',
    status: 'Coming Soon',
    action: 'Coming Soon',
  },
]

export const teamMembers = [
  {
    id: 'tm-1',
    name: 'Josh Salinas',
    email: 'josh@commandly.ai',
    role: 'Owner',
    avatar: 'JS',
  },
  {
    id: 'tm-2',
    name: 'Nia Coleman',
    email: 'nia@commandly.ai',
    role: 'Manager',
    avatar: 'NC',
  },
  {
    id: 'tm-3',
    name: 'Chris Howard',
    email: 'chris@commandly.ai',
    role: 'Viewer',
    avatar: 'CH',
  },
]

export const permissions = [
  { id: 'perm-1', label: 'Manage Billing', description: 'Update plans and payment details.' },
  { id: 'perm-2', label: 'Approve AI Replies', description: 'Review and publish customer-facing outputs.' },
  { id: 'perm-3', label: 'Create Campaigns', description: 'Launch marketing campaigns and automations.' },
  { id: 'perm-4', label: 'View Analytics', description: 'Access reports, trends, and workspace insights.' },
]

export const billingHistory = [
  { id: 'bill-1', invoice: 'INV-2048', date: 'May 1, 2026', amount: '$49.00', status: 'Paid' },
  { id: 'bill-2', invoice: 'INV-1974', date: 'Apr 1, 2026', amount: '$49.00', status: 'Paid' },
  { id: 'bill-3', invoice: 'INV-1882', date: 'Mar 1, 2026', amount: '$19.00', status: 'Paid' },
]

export const billingUsage = [
  { label: 'AI prompts used', value: '412 / 1,000' },
  { label: 'Review replies', value: '58 / 200' },
  { label: 'Campaigns created', value: '14 / 40' },
  { label: 'Leads tracked', value: '96 / 500' },
]

export const pricingPlans = [
  { name: 'Starter', price: '$19/mo', description: 'For solo creators and small businesses' },
  { name: 'Pro', price: '$49/mo', description: 'For growing businesses that want automation' },
  { name: 'Business', price: '$99/mo', description: 'For teams, agencies, and advanced workflows' },
]

export const notifications = [
  {
    id: 'note-1',
    title: 'New lead received',
    detail: 'Taylor Green requested pricing from the website form.',
    time: '2 min ago',
  },
  {
    id: 'note-2',
    title: 'Review reply ready',
    detail: 'A draft response for Jordan Patel is waiting for approval.',
    time: '12 min ago',
  },
  {
    id: 'note-3',
    title: 'Campaign completed',
    detail: 'Summer Detail Promo finished with 27 conversions.',
    time: '1 hr ago',
  },
  {
    id: 'note-4',
    title: 'Weekly report ready',
    detail: 'Your AI growth summary is available in Analytics.',
    time: '3 hr ago',
  },
  {
    id: 'note-5',
    title: 'Automation paused',
    detail: 'Weekly social content plan was paused by Nia Coleman.',
    time: 'Yesterday',
  },
]

export const savedDrafts = [
  {
    id: 'draft-1',
    title: 'Spring promo caption',
    updatedAt: 'Updated 2 hours ago',
    preview: 'Fresh finish, premium shine, and a limited-time package built for first-time clients...',
  },
  {
    id: 'draft-2',
    title: 'Lead nurture email',
    updatedAt: 'Updated yesterday',
    preview: 'Thanks for reaching out. Here is what working with Commandly AI could look like for your team...',
  },
  {
    id: 'draft-3',
    title: 'Google ad variation',
    updatedAt: 'Updated 3 days ago',
    preview: 'More leads. Faster replies. Smarter local growth powered by one AI dashboard.',
  },
]

export const searchDataset = [
  ...campaigns.map((item) => ({
    id: item.id,
    type: 'Campaign',
    title: item.name,
    subtitle: `${item.channel} - ${item.status}`,
    path: '/dashboard/campaigns',
  })),
  ...leads.map((item) => ({
    id: item.id,
    type: 'Lead',
    title: item.name,
    subtitle: `${item.source} - ${item.status}`,
    path: '/dashboard/leads',
  })),
  ...reviews.map((item) => ({
    id: item.id,
    type: 'Review',
    title: item.customer,
    subtitle: `${item.source} - ${item.status}`,
    path: '/dashboard/reviews',
  })),
  ...automations.map((item) => ({
    id: item.id,
    type: 'Automation',
    title: item.title,
    subtitle: item.status,
    path: '/dashboard/automations',
  })),
]
