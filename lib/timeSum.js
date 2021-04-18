export default function timeSum(time, resumed) {
  if (resumed) {
    time += Date.now() - resumed
  }
  return time
}
