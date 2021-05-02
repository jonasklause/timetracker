import Vue from 'vue'

export const state = () => ({
  items: [],
})

export const getters = {
  isAnyRunning: (state) => {
    return !!state.items.find((item) => item.resumedAt)
  },
  byId: (state) => (id) => {
    return state.items.find((item) => item.id === id)
  },
}

export const mutations = {
  init(state, { items }) {
    state.items = items
  },
  add(state) {
    const newId = Math.max(0, ...state.items.map((item) => item.id)) + 1

    state.items.unshift({
      id: newId,
      label: '',
      resumedAt: Date.now(),
      pausedWith: parseInt(state.settings.startAt || 0),
    })
  },
  remove(state, id) {
    const index = state.items.findIndex((item) => item.id === id)
    state.items.splice(index, 1)
  },
  update(state, payload) {
    const index = state.items.findIndex((item) => item.id === payload.id)
    Vue.set(state.items, index, { ...state.items[index], ...payload })
  },
  updateTime(state, { id, time, absolute }) {
    const index = state.items.findIndex((item) => item.id === id)
    const item = state.items[index]

    if (absolute) {
      Vue.set(state.items, index, {
        ...item,
        pausedWith: time,
        resumedAt: item.resumedAt ? Date.now() : 0,
      })
    } else {
      Vue.set(state.items, index, {
        ...item,
        pausedWith: item.pausedWith + time,
      })
    }
  },
  pause(state, id) {
    const index = state.items.findIndex((item) => item.id === id)
    const item = state.items[index]

    item.pausedWith += Date.now() - item.resumedAt
    item.resumedAt = 0
  },
}

export const actions = {
  pauseAll({ state, commit }) {
    state.items
      .filter((item) => item.resumedAt)
      .forEach((item) => {
        commit('pause', item.id)
      })
  },
  resume(context, { id, exclusive }) {
    if (exclusive) {
      context.dispatch('pauseAll')
    }
    context.commit('update', {
      id,
      resumedAt: Date.now(),
    })
  },
}
