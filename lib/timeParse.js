export default function timeParse(text) {
  const expressions = [
    {
      pattern: /^(\d+([,.]\d+)?)$/,
      groups: [{ num: 1, factor: 60000 }],
    },
    {
      pattern: /^((\d+):)?(\d+)(:(\d+))$/,
      groups: [
        { num: 2, factor: 60 * 60 * 1000 },
        { num: 3, factor: 60 * 1000 },
        { num: 5, factor: 1000 },
      ],
    },
    {
      pattern: /^(\d+):(\d+):(\d+):(\d+)$/,
      groups: [
        { num: 1, factor: 1000 * 60 * 60 * 24 },
        { num: 2, factor: 1000 * 60 * 60 },
        { num: 3, factor: 1000 * 60 },
        { num: 4, factor: 1000 },
      ],
    },
    {
      pattern: /^(?=\d+([,.]\d+)?[dhms])((\d+([,.]\d+)?)d)?\s*((\d+([,.]\d+)?)h)?\s*((\d+([,.]\d+)?)m)?\s*((\d+([,.]\d+)?)s)?$/,
      groups: [
        { num: 3, factor: 1000 * 60 * 60 * 24 },
        { num: 6, factor: 1000 * 60 * 60 },
        { num: 9, factor: 1000 * 60 },
        { num: 12, factor: 1000 },
      ],
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
    const capture = (match[g.num] || '0').replace(',', '.')
    time += parseFloat(capture) * g.factor
  })

  return Math.floor(time)
}
