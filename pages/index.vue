<template>
  <div>
    <div class="grid gap-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2">
      <button
        class="bg-gray-700 w-full text-center text-7xl pt-2 pb-3"
        @click="addTimer"
      >
        +
      </button>
      <Timer v-for="item in items" :key="item.id" v-bind="item" />
    </div>
    <div class="mt-4">Summe: {{ sum() }}</div>
    <NuxtChild />
  </div>
</template>

<script>
import timeSum from '../lib/timeSum.js'
import timeFormat from '../lib/timeFormat.js'

export default {
  data() {
    return {
      interval: null,
    }
  },
  computed: {
    items() {
      return this.$store.state.items
    },
    anyRunning() {
      return this.$store.getters.isAnyRunning
    },
  },
  watch: {
    anyRunning(value) {
      this.renderInterval(value)
    },
  },
  mounted() {
    this.renderInterval(this.anyRunning)
  },
  beforeDestroy() {
    this.renderInterval(false)
  },
  methods: {
    sum() {
      const sum = this.items
        .map((item) => timeSum(item.pausedWith, item.resumedAt))
        .reduce((i, j) => i + j, 0)
      return timeFormat(sum)
    },
    renderInterval(start) {
      if (!start && this.interval) {
        clearInterval(this.interval)
      } else if (start) {
        this.interval = setInterval(() => {
          this.$forceUpdate()
        }, 1000)
      }
    },
    addTimer(event) {
      if (this.$store.state.settings.pauseOthersOnResume && !event.metaKey) {
        this.$store.dispatch('pauseAll')
      }
      this.$store.commit('add')
      const newId = this.$store.state.items[0].id
      this.$store.commit('history/addEntry', {
        type: 'timer/add',
        text: 'added new timer #' + newId,
      })
    },
  },
}
</script>
