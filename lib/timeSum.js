export default function timeSum(time, resumed, label) {
  const easterEgg = easterEggs(label)

  if (easterEgg) {
    return easterEgg
  }

  if (resumed) {
    time += Date.now() - resumed
  }
  return time
}

function easterEggs(label) {
  if (!label) return false
  if (label.toLowerCase() === 'jsonas' || label.toLowerCase() === '#jonas') {
    return new Date(2022, 1, 19, 9).valueOf() - Date.now()
  }
  if (label.toLowerCase() === '#hugo') {
    return new Date(2021, 1, 19, 3, 9).valueOf() - Date.now()
  }
}
