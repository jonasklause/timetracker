export const state = () => ({
  items: [],
})

export const mutations = {
  clear(state) {
    state.items = []
  },
}
