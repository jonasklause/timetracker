export default function timeFormat(time, format) {
  time = Math.round(time / 1000)
  time = Math.abs(time)
  if (format) return altFormat(time)

  const u = toUnits(time)
  if (u.seconds < 10) u.seconds = '0' + u.seconds
  if (u.minutes < 10) u.minutes = '0' + u.minutes
  if (u.hours < 10) u.hours = '0' + u.hours
  if (!u.days) delete u.days

  return Object.values(u).join(':')
}

function toUnits(sec) {
  return {
    days: Math.floor(sec / (60 * 60 * 24)),
    hours: Math.floor(sec / (60 * 60)) % 24,
    minutes: Math.floor(sec / 60) % 60,
    seconds: sec % 60,
  }
}

function altFormat(time) {
  if (!time) return '0'
  const { seconds, minutes, hours, days } = toUnits(time)
  const out = []
  if (days) out.push(days + 'd')
  if (hours) out.push(hours + 'h')
  if (minutes) out.push(minutes + 'm')
  if (seconds) out.push(seconds + 's')
  return out.join(' ')
}
