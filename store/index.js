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
  add(state, type) {
    const id =
      Math.max(
        0,
        ...[...state.items, ...state.trash.items].map((item) => item.id)
      ) + 1
    const label = ''
    let pausedWith = parseInt(state.settings.startAt || 0)
    let resumedAt = Date.now()

    if (type === 1) {
      pausedWith = 0
      resumedAt = 0
    }

    state.items.unshift({ id, type, label, resumedAt, pausedWith })
  },
  remove(state, id) {
    const index = state.items.findIndex((item) => item.id === id)
    state.trash.items.unshift(state.items.splice(index, 1)[0])
    state.trash.items.splice(50)
  },
  restore(state) {
    if (state.trash.items.length) {
      state.items.unshift(state.trash.items.shift())
    }
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
