import Cleave from 'cleave.js'

/**
 * Vue 3 directive wrapping cleave.js for duration inputs.
 * Expects a `.duration input` descendant (Buefy b-input).
 */
export const cleaveDirective = {
  mounted(el, binding) {
    const duration = el.querySelector('.duration input')
    if (duration) {
      duration._vCleave = new Cleave(duration, binding.value)
    }
  },
  updated(el, binding) {
    const duration = el.querySelector('.duration input')
    if (duration && duration._vCleave && binding.value) {
      // Cleave has no formal update API; recreate if options change
    }
  },
  unmounted(el) {
    const duration = el.querySelector('.duration input')
    if (duration && duration._vCleave) {
      duration._vCleave.destroy()
      delete duration._vCleave
    }
  }
}

export default cleaveDirective
