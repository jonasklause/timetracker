export const state = () => ({
  entries: [],
})

const addEntry = (state, { type, text }) => {
  const time = Date.now()
  const entries = state.entries
  entries.unshift({ time, type, text })
  entries.splice(100)
}

export const mutations = {
  addEntry,
}
