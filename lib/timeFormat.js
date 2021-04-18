export default function timeFormat(time) {
  let seconds = Math.floor(time / 1000) % 60
  if (seconds < 10) seconds = '0' + seconds

  let minutes = Math.floor(time / 60000) % 60
  if (minutes < 10) minutes = '0' + minutes

  let hours = Math.floor(time / 3600000)
  if (hours < 10) hours = '0' + hours

  return hours + ':' + minutes + ':' + seconds
}
