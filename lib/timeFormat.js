export default function timeFormat(time, format) {
  time = Math.round(time / 1000)
  time = Math.abs(time)
  if (format === 2) return leftTrimmed(time)
  if (format === 3) return bothTrimmed(time)
  if (format) return altFormat(time)

  return classic(time)
}

function toUnits(sec) {
  return {
    days: Math.floor(sec / (60 * 60 * 24)),
    hours: Math.floor(sec / (60 * 60)) % 24,
    minutes: Math.floor(sec / 60) % 60,
    seconds: sec % 60,
  }
}

function twoDigits(input) {
  input = '' + parseInt(input)
  if (input.length < 2) input = '0' + input
  return input
}

function classic(time) {
  const u = toUnits(time)
  if (u.seconds < 10) u.seconds = '0' + u.seconds
  if (u.minutes < 10) u.minutes = '0' + u.minutes
  if (u.hours < 10) u.hours = '0' + u.hours
  if (!u.days) delete u.days

  return Object.values(u).join(':')
}

function unitLabel(units) {
  const unitsGerman = {
    days: 'Tage',
    hours: 'Stunden',
    minutes: 'Minuten',
    seconds: 'Sekunden',
  }
  for (const u in units) {
    if (units[u]) return unitsGerman[u]
  }
  return ''
}

function leftTrimmed(time) {
  const units = toUnits(time)
  return Object.values(units)
    .map(twoDigits)
    .join(':')
    .replace(/^[0:]+/, '')
    .concat(' ', unitLabel(units))
}

function bothTrimmed(time) {
  const units = toUnits(time)
  return Object.values(units)
    .map(twoDigits)
    .join(':')
    .replace(/^[0:]+/, '')
    .replace(/(:00)+$/, '')
    .concat(' ', unitLabel(units))
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
