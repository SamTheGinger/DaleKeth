// Form submission state shared by the site's forms.
//   const { handleSubmit, isSending, error, result } = useSubmit(async (form) => { ...; return result })
// `form` is the submitted FormData as a plain object. `result` is whatever `send` returns (null until success).
import { useState } from 'react'

export default function useSubmit(send) {
  const [state, setState] = useState({ isSending: false, error: null, result: null })

  async function handleSubmit(event) {
    event.preventDefault()
    const form = Object.fromEntries(new FormData(event.target))
    setState({ isSending: true, error: null, result: null })
    try {
      const result = await send(form)
      setState({ isSending: false, error: null, result })
    } catch (error) {
      setState({ isSending: false, error, result: null })
    }
  }

  return { ...state, handleSubmit }
}
