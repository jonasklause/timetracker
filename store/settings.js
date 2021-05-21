import Vue from 'vue'

export const state = () => ({
  pauseOthersOnResume: false,
})

export const mutations = {
  set(state, { key, value }) {
    Vue.set(state, key, value)
  },
  get(state, key) {
    return state[key]
  },
}
