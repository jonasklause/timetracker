export const state = () => ({
  items: [],
})

export const mutations = {
  clear(state) {
    state.items = []
  },
  remove(state, id) {
    const index = state.items.findIndex((item) => item.id === id)
    state.items.splice(index, 1)
  },
}
