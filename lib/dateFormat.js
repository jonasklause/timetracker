export default function dateFormat(d) {
  const date = new Date(d)
  const relativeDay = getRelativeDay(date)
  const options = {
    hour: 'numeric',
    minute: '2-digit',
  }
  let prefix = ''

  if (relativeDay > 1 || relativeDay < -6) {
    options.day = 'numeric'
    options.month = 'long'
  } else if (relativeDay < -1) {
    options.weekday = 'long'
  } else {
    prefix = ['Gestern, ', 'Heute, ', 'Morgen, '][parseInt(relativeDay) + 1]
  }

  const formatter = new Intl.DateTimeFormat(undefined, options)
  return prefix + formatter.format(date)
}

function getRelativeDay(d) {
  const today = new Date()
  const date = new Date(d.valueOf())

  ;[date, today].forEach((d) => {
    d.setUTCHours(12)
    d.setUTCMinutes(0)
    d.setUTCSeconds(0)
    d.setUTCMilliseconds(0)
  })
  return Math.round((date - today) / (1000 * 60 * 60 * 24))
}
