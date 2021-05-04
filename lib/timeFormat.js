export default function timeFormat(time, format) {
  // time = Math.abs(time)

  if (format) return altFormat(time)

  let { seconds, minutes, hours } = toHoursMinutesSecondes(time)

  if (seconds < 10) seconds = '0' + seconds
  if (minutes < 10) minutes = '0' + minutes
  if (hours < 10) hours = '0' + hours

  return hours + ':' + minutes + ':' + seconds
}

function toHoursMinutesSecondes(ms) {
  return {
    hours: Math.floor(ms / 3600000),
    minutes: Math.floor(ms / 60000) % 60,
    seconds: Math.floor(ms / 1000) % 60,
  }
}

function altFormat(time) {
  if (!time) return '0'
  const { seconds, minutes, hours } = toHoursMinutesSecondes(time)
  const out = []
  if (hours) out.push(hours + 'h')
  if (minutes) out.push(minutes + 'm')
  if (seconds) out.push(seconds + 's')
  return out.join(' ')
}
