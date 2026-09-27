/**
 * Format duration input as HH h MM m while typing.
 * @param {string} value
 * @returns {string}
 */
export function durationFilter(value) {
  if (!value) return value
  let hrs, mins
  if (value.length === 4) {
    hrs = value.slice(0, 2)
    if (hrs > 12) {
      hrs = 12
    }
    return hrs + 'h '
  }
  if (value.length >= 6) {
    mins = value.slice(4, 6)
    hrs = value.slice(0, 2)
    if (hrs > 12) {
      hrs = 12
    }
    if (mins > 59) {
      mins = 59
    }
    return hrs + 'h ' + mins + 'm'
  }
  return value
}

/**
 * Convert seconds to "X hrs Y mins".
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
