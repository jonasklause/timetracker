export default function timeParse(text) {
  const expressions = [
    {
      pattern: /(\d+):(\d+):(\d+)/g,
      groups: [
        { num: 1, factor: 60 * 60 * 1000 },
        { num: 2, factor: 60 * 1000 },
        { num: 3, factor: 1000 },
      ],
    },
    {
      pattern: /(\d+):(\d+)/g,
      groups: [
        { num: 1, factor: 60 * 1000 },
        { num: 2, factor: 1000 },
      ],
    },
    {
      pattern: /(\d+(,\d+)?)h/g,
      groups: [{ num: 1, factor: 60 * 60 * 1000 }],
    },
    {
      pattern: /(\d+(,\d+)?)m?/g,
      groups: [{ num: 1, factor: 60 * 1000 }],
    },
  ]

  let match = false
  let groups
  expressions.some(function (exp) {
    match = exp.pattern.exec(text)
    groups = exp.groups
    return match
  })

  if (!match) {
    return false
  }

  let time = 0
  groups.forEach(function (g) {
    const capture = match[g.num].replace(',', '.') || 0
    time += parseFloat(capture) * g.factor
  })

  return Math.floor(time)
}
