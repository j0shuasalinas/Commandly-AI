import { useMemo, useState } from 'react'
import { Sparkles, Star } from 'lucide-react'
import Card from '../../components/ui/Card'
import Dropdown from '../../components/ui/Dropdown'

function Reviews({ reviews = [] }) {
  const [sourceFilter, setSourceFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  const filteredReviews = useMemo(
    () =>
      reviews.filter((review) => {
        const sourceMatch = sourceFilter === 'All' || review.source === sourceFilter
        const statusMatch = statusFilter === 'All' || review.status === statusFilter
        return sourceMatch && statusMatch
      }),
    [reviews, sourceFilter, statusFilter],
  )

  const metrics = useMemo(
    () => [
      {
        label: 'Average Rating',
        value:
          reviews.length > 0
            ? (reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / reviews.length).toFixed(1)
            : '0.0',
      },
      {
        label: 'Response Rate',
        value:
          reviews.length > 0
            ? `${Math.round((reviews.filter((item) => item.status === 'Published').length / reviews.length) * 100)}%`
            : '0%',
      },
      { label: 'New Reviews', value: `${reviews.filter((item) => item.status === 'New').length}` },
      {
        label: 'Sentiment Score',
        value: reviews.length > 0 ? `${reviews.filter((item) => Number(item.rating) >= 4).length * 20}` : '0',
      },
    ],
    [reviews],
  )

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Reviews
          </h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
            Manage incoming reviews, draft faster replies, and keep your response
            workflow polished.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Dropdown
            items={['All', 'Google', 'Facebook', 'Yelp', 'Website'].map((item) => ({
              id: item,
              label: item,
            }))}
            label={sourceFilter}
            onSelect={(item) => setSourceFilter(item.label)}
          />
          <Dropdown
            items={['All', 'New', 'Drafted', 'Approved', 'Published'].map((item) => ({
              id: item,
              label: item,
            }))}
            label={statusFilter}
            onSelect={(item) => setStatusFilter(item.label)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <div className="text-sm text-slate-500 dark:text-slate-400">{metric.label}</div>
            <div className="mt-3 text-4xl font-semibold text-slate-950 dark:text-white">
              {metric.value}
            </div>
          </Card>
        ))}
      </div>

      {filteredReviews.length > 0 ? (
        <div className="grid gap-6 xl:grid-cols-2">
          {filteredReviews.map((review) => (
            <Card key={review.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-slate-950 dark:text-white">
                    {review.customer}
                  </div>
                  <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {review.source} - {review.review_date || 'No date'}
                  </div>
                </div>
                <div className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                  {review.status}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1 text-amber-500">
                {Array.from({ length: Number(review.rating || 0) }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" />
                ))}
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {review.review_text}
              </p>

              <div className="mt-5 rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white">
                  <Sparkles className="h-4 w-4 text-brand-500" />
                  Suggested AI reply
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {review.ai_reply || 'No AI reply has been generated yet.'}
                </p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center">
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
            No reviews yet
          </h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Connect a review source and your incoming customer feedback will show up here.
          </p>
        </Card>
      )}
    </div>
  )
}

export default Reviews
