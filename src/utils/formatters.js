/**
 * Split total seconds into hours and minutes parts.
 * @param {number} seconds
 * @returns {{ hours: number, minutes: number }}
 */
export function secondsToParts(seconds) {
  const total = Math.max(0, Math.floor(Number(seconds) || 0))
  const hours = Math.min(12, Math.floor(total / 3600))
  const minutes = Math.min(59, Math.floor((total % 3600) / 60))
  return { hours, minutes }
}

/**
 * Convert hours + minutes into total seconds.
 * @param {number} hours
 * @param {number} minutes
 * @returns {number}
 */
export function partsToSeconds(hours, minutes) {
  const h = Math.min(12, Math.max(0, Math.floor(Number(hours) || 0)))
  const m = Math.min(59, Math.max(0, Math.floor(Number(minutes) || 0)))
  return h * 3600 + m * 60
}

/**
 * Human-readable duration label, e.g. "1h 15m".
 * @param {number} seconds
 * @returns {string}
 */
export function formatDurationLabel(seconds) {
  const { hours, minutes } = secondsToParts(seconds)
  if (hours === 0 && minutes === 0) return '0m'
  if (hours === 0) return `${minutes}m`
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}m`
}

/**
 * Convert seconds to "X hrs Y mins" (list/export display).
 * @param {number} seconds
 * @returns {string}
 */
export function secondsToHrsMins(seconds) {
  if (!seconds) return '0 hrs 0 mins'
  let mins = seconds / 60
  const hrs = Math.floor(mins / 60)
  mins = mins % 60
  return hrs + 'hrs ' + mins + 'mins'
}

/**
 * Convert "YYYY.M.D" date string to locale date string.
 * @param {string} dateString
 * @returns {string}
 */
export function dateToHuman(dateString) {
  if (!dateString) return ''
  const dateArray = dateString.split('.')
  const day = dateArray[2]
  const month = dateArray[1] - 1
  const year = dateArray[0]
  const date = new Date(year, month, day)
  return date.toLocaleDateString()
}
