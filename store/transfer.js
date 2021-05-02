export const state = () => ({
  sourceId: null,
  targetId: null,
  time: 0,
})

export const mutations = {
  setTarget(state, id) {
    state.targetId = id
  },
  setSource(state, id) {
    state.sourceId = id
  },
  setTime(state, time) {
    state.time = time
  },
}
