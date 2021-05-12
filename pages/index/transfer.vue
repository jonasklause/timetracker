<template>
  <div
    v-if="sourceId"
    class="fixed top-0 left-0 w-full bg-gray-800 bg-opacity-60 h-screen flex items-center justify-center"
    @click.self="$router.push({ path: '/' })"
  >
    <div
      class="max-w-screen-sm w-full bg-gray-700 border-2 border-gray-600 max-h-screen overflow-auto"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="options-menu"
    >
      <div class="float-right">
        <NuxtLink to="/" class="inline-block p-2">
          <IconBase width="20" height="20">
            <IconDelete />
          </IconBase>
        </NuxtLink>
      </div>
      <div class="p-2">
        <h2 class="text-sm mb-1 text-gray-500">#{{ sourceId }}</h2>
        <div class="text-lg">
          {{ sourceLabel }}
        </div>
        <hr class="border-gray-600 my-3 border-1" />
        <h2 class="text-xl mb-4">
          Zeit verschieben
          <span class="text-gray-400 text-sm">
            <br />
            Wieviel soll verschoben werden?
          </span>
        </h2>
        <TransferTimeSelection />

        <hr class="my-4 birder-2 border-gray-600" />

        <h2 class="text-xl mb-4">
          Ziel auswählen
          <span class="text-gray-400 text-sm">
            <br />
            Wohin soll verschoben werden?
          </span>
        </h2>
        <TransferItemSelection />

        <div class="text-right mt-6">
          <button
            class="bg-green-700 hover:bg-green-800 px-4 py-2 inline-block rounded"
            :disabled="
              !$store.state.transfer.targetId || !$store.state.transfer.time
            "
            @click="submit"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import timeSum from '../lib/timeSum.js'
import timeFormat from '../../lib/timeFormat.js'

export default {
  props: {
    maxTime: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      time: this.maxTime,
      targetItem: null,
      timeSuggestions: [1, 5, 10, 20, 45],
    }
  },
  computed: {
    sourceId() {
      return this.$store.state.transfer.sourceId
    },
    sourceLabel() {
      const timerItem = this.$store.getters.byId(this.sourceId) || {}
      return timerItem.label || ''
    },
  },
  created() {
    if (!this.sourceId) {
      this.$router.push('/')
    }
  },
  methods: {
    submit() {
      const { targetId, sourceId, time } = this.$store.state.transfer
      if (!targetId) return
      this.$store.commit('updateTime', {
        id: sourceId,
        time: -time,
      })
      this.$store.commit('updateTime', {
        id: targetId,
        time: +time,
      })

      this.$store.commit('history/addEntry', {
        type: 'timer/item/transfer',
        text: `transferred ${timeFormat(
          time
        )} from #${sourceId} to #${targetId}`,
      })
      this.$router.push('/')
    },
  },
}
</script>
