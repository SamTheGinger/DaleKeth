// Tailwind class lists shared by every form on the site (booking, artwork purchase, event booking),
// so all the forms look the same and a style change only has to be made here.
// Each word is a Tailwind "utility class" that applies one small piece of styling.
// A prefix like sm: or md: means "only from that screen width up" (sm = 640px, md = 900px).

// Labels: block = own line, mt-4 / mb-1.5 = space above / below, font-body = Inter font,
// font-bold = bold, tracking-[0.5px] = slightly spaced letters, text-text = off-white, uppercase = CAPITALS.
export const labelClasses =
  'mt-4 mb-1.5 block font-body text-[0.9rem] font-bold tracking-[0.5px] text-text uppercase sm:mt-6 sm:mb-2 sm:text-base md:text-xl'

// Text boxes: w-full = full width, rounded-[10px] = rounded corners, border-[3px] = thick border,
// bg-text = off-white background, text-background = near-black text, px-3 / py-3 = inner spacing,
// outline-none = no default blue focus ring, focus:border-accent = gold border while typing in it,
// placeholder:italic = the grey hint text is italic.
export const inputClasses =
  'w-full rounded-[10px] border-[3px] border-background bg-text px-3 py-3 font-body text-base text-background outline-none transition-colors placeholder:text-background placeholder:italic focus:border-accent sm:py-4 md:py-5'

// Submit buttons: bg-accent = gold background, hover:bg-muted = grey when the mouse is over it,
// active:scale-[0.98] = shrinks very slightly while being pressed, cursor-pointer = hand cursor.
export const submitClasses =
  'mt-8 w-full cursor-pointer rounded bg-accent px-4 py-4 font-heading text-lg font-bold text-background transition-colors hover:bg-muted active:scale-[0.98]'

// The thank-you box shown after a form is sent: gold border, rounded corners, centred text.
export const thankYouClasses = 'mt-6 rounded-lg border-2 border-accent p-5 text-center font-body text-text'
