// The order page (#/order/5): where Stripe sends the buyer after paying. It shows whether the order is paid.
//
// Why it checks more than once: Stripe sends the buyer back here and, separately, tells our server the payment
// went through (the webhook). The webhook can arrive a moment AFTER the buyer does, so the order may still say
// 'pending' at first. While it does, this page asks again every 2 seconds, up to MAX_CHECKS times.
import { useEffect, useState } from 'react'
import { apiFetch } from '../utils/api.js' // GET /api/orders/:id
import { authClient } from '../utils/authClient.js' // Orders can only be seen by the account that made them.
import { formatDate, formatPrice } from '../utils/format.js'
import { submitClasses, thankYouClasses } from '../components/formStyles.js'
import NotFoundPage from './NotFoundPage.jsx'

const MAX_CHECKS = 6 // 6 checks, 2 seconds apart: about 10 seconds.
const CHECK_EVERY_MS = 2000

// Props (input from App.jsx):
//   orderId  the number from the address, e.g. 5 for #/order/5.
function OrderPage({ orderId }) {
  const { data: session, isPending } = authClient.useSession()
  const userId = session?.user?.id

  const [order, setOrder] = useState(null) // The order from the server (null until it arrives).
  const [error, setError] = useState(null)
  const [isChecking, setIsChecking] = useState(true) // True while a round of checks is running.
  const [round, setRound] = useState(0) // "Check again" adds 1, which starts another round of checks.

  function handleCheckAgain() {
    setIsChecking(true)
    setRound((r) => r + 1)
  }

  useEffect(() => {
    if (!userId) return
    let isCurrent = true // Stop if the visitor leaves the page (or signs out) in the middle.
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
          timer = setTimeout(check, CHECK_EVERY_MS) // Not paid yet: ask again in 2 seconds.
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
    // A heading and message for each status.
    const messages = {
      paid: { title: 'Payment received. Thank you!', text: 'Your spots are confirmed. We’ll email you the event details before the day.' },
      pending: isChecking
        ? { title: 'Confirming your payment…', text: 'Waiting for Stripe to confirm the payment. This usually takes a few seconds.' }
        : { title: 'Still waiting for confirmation', text: 'Stripe hasn’t confirmed this payment yet. If you paid, check again in a moment.' },
      expired: { title: 'This checkout expired', text: 'No payment was taken. You can start again from the event’s page.' },
    }
    const message = messages[order.status]

    content = (
      // role="status" makes screen readers announce the change from "Confirming…" to "Payment received".
      <div role="status" className={thankYouClasses}>
        <p className={`text-xl ${order.status === 'paid' ? 'text-accent' : 'text-text'}`}>
          {order.status === 'paid' && '✓ '}
          {message.title}
        </p>
        <p className="mt-2">{message.text}</p>

        {/* What was bought. */}
        <dl className="mt-6 grid grid-cols-[1fr_auto] gap-x-6 gap-y-2 text-left">
          {order.items.map((item) => (
            <div key={item.eventId} className="contents">
              <dt>
                <a href={`#/event/${item.eventId}`} className="text-text underline hover:text-accent">{item.title}</a> &times; {item.quantity} {item.quantity === 1 ? 'spot' : 'spots'}
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

export default OrderPage // Lets App.jsx load this with: import OrderPage from './pages/OrderPage.jsx'
