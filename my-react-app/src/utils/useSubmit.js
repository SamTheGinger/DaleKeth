// A hook shared by the site's forms: it sends the form to the server and remembers how it went.
//
//   const { handleSubmit, isSending, error, result } = useSubmit(async (form) => { ...send it...; return what to show })
//   <form onSubmit={handleSubmit}>
//
//   form       everything typed into the form, by name: { name: 'Thandi', email: '...' }
//   isSending  true while waiting for the server (use it to disable the button so it isn't sent twice).
//   error      what went wrong, or null. error.message is safe to show.
//   result     whatever send() gave back once it worked, or null until then (use it for the thank-you message).
import { useState } from 'react'

function useSubmit(send) {
  const [state, setState] = useState({ isSending: false, error: null, result: null })

  async function handleSubmit(event) {
    event.preventDefault() // Stop the browser reloading the page.
    // Object.fromEntries turns the FormData into a plain object: { name: '...', email: '...' }.
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

export default useSubmit // Lets other files load this with: import useSubmit from '../utils/useSubmit.js'
