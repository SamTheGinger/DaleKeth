import { useEffect, useState } from 'react'
import { submitClasses, thankYouClasses } from '../components/formStyles.js'
import { apiFetch } from '../utils/api.js'
import { authClient } from '../utils/authClient.js'
import { formatDate, formatPrice, formatSpots } from '../utils/format.js'
import NotFoundPage from './NotFoundPage.jsx'

// Stripe Checkout's success_url (#/order/:id). The buyer's redirect and Stripe's webhook race, so the order
// may still be 'pending' on arrival; poll until it resolves or the attempts run out.
const MAX_CHECKS = 6
const CHECK_INTERVAL_MS = 2000

const STATUS_MESSAGES = {
  paid: { title: 'Payment received. Thank you!', text: 'Your spots are confirmed. We’ll email you the event details before the day.' },
  checking: { title: 'Confirming your payment…', text: 'Waiting for Stripe to confirm the payment. This usually takes a few seconds.' },
  pending: { title: 'Still waiting for confirmation', text: 'Stripe hasn’t confirmed this payment yet. If you paid, check again in a moment.' },
  expired: { title: 'This checkout expired', text: 'No payment was taken. You can start again from the event’s page.' },
}

export default function OrderPage({ orderId }) {
  const { data: session, isPending } = authClient.useSession()
  const userId = session?.user?.id

  const [order, setOrder] = useState(null)
  const [error, setError] = useState(null)
  const [isChecking, setIsChecking] = useState(true)
  const [round, setRound] = useState(0) // Incremented by "Check Again" to restart polling.

  function handleCheckAgain() {
    setIsChecking(true)
    setRound((r) => r + 1)
  }

  useEffect(() => {
    if (!userId) return
    let isCurrent = true
    let timer
    let checks = 0

    async function check() {
      checks += 1
      try {
        const latest = await apiFetch(`/api/orders/${orderId}`)
        if (!isCurrent) return
        setOrder(latest)
        setError(null)
        if (latest.status === 'pending' && checks < MAX_CHECKS) {
          timer = setTimeout(check, CHECK_INTERVAL_MS)
          return
        }
      } catch (checkError) {
        if (!isCurrent) return
        setError(checkError)
      }
      setIsChecking(false)
    }

    check()
    return () => {
      isCurrent = false
      clearTimeout(timer)
    }
  }, [userId, orderId, round])

  if (!Number.isInteger(orderId) || error?.status === 404) return <NotFoundPage />

  let content
  if (isPending || (userId && !order && !error)) {
    content = <p className="animate-pulse text-center font-body text-muted">Checking your order&hellip;</p>
  } else if (!userId) {
    content = (
      <p className="text-center font-body text-text">
        Please <a href="#/signin" className="text-accent underline hover:text-muted">sign in</a> to see this order.
      </p>
    )
  } else if (error) {
    content = <p role="alert" className="text-center font-body text-text">{error.message}</p>
  } else {
    const message = STATUS_MESSAGES[order.status === 'pending' && isChecking ? 'checking' : order.status]

    content = (
      <div role="status" className={thankYouClasses}>
        <p className={`text-xl ${order.status === 'paid' ? 'text-accent' : 'text-text'}`}>
          {order.status === 'paid' && '✓ '}
          {message.title}
        </p>
        <p className="mt-2">{message.text}</p>

        <dl className="mt-6 grid grid-cols-[1fr_auto] gap-x-6 gap-y-2 text-left">
          {order.items.map((item) => (
            <div key={item.eventId} className="contents">
              <dt>
                <a href={`#/event/${item.eventId}`} className="text-text underline hover:text-accent">{item.title}</a> &times; {formatSpots(item.quantity)}
              </dt>
              <dd className="text-right">{formatPrice(item.unitPrice * item.quantity)}</dd>
            </div>
          ))}
          <dt className="border-t border-muted/40 pt-2 font-semibold">Total</dt>
          <dd className="border-t border-muted/40 pt-2 text-right font-semibold text-accent">{formatPrice(order.total)}</dd>
        </dl>
        <p className="mt-4 text-sm text-muted">
          Order #{order.id} &middot; {formatDate(order.date)} &middot; Status: <span className="text-text">{order.status}</span>
        </p>

        {order.status === 'pending' && !isChecking && (
          <button type="button" onClick={handleCheckAgain} className={submitClasses}>
            Check Again
          </button>
        )}
      </div>
    )
  }

  return (
    <section className="mx-auto w-[calc(100%-2rem)] max-w-[560px] py-10 sm:w-full sm:py-16">
      <h1 className="mb-6 text-center text-3xl text-text sm:text-4xl">
        Your <span className="text-muted">Order.</span>
      </h1>
      {content}
      <p className="mt-8 text-center">
        <a href="#events" className="font-body font-semibold text-accent hover:text-muted">&larr; Back to Events</a>
      </p>
    </section>
  )
}
