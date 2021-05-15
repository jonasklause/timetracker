<template>
  <div>
    <div class="grid gap-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2">
      <div class="flex text-center">
        <button class="w-full p-2" @click="addTimer($event, 0)">
          <IconBase width="48" height="48" class="mx-auto">
            <IconStoppwatch />
          </IconBase>
          <span class="text-sm">+&nbsp;Stoppuhr</span>
        </button>
        <button class="w-full p-2" @click="addTimer($event, 1)">
          <IconBase width="48" height="48" class="mx-auto">
            <IconCountdown />
          </IconBase>
          <span class="text-sm">+&nbsp;Countdown</span>
        </button>
        <button
          v-if="$store.state.trash.items.length"
          class="p-4 relative"
          title="Letzten Timer aus Papierkorb wiederherstellen"
          @click="$store.commit('restore')"
        >
          <span
            class="absolute text-sm left-10 font-bold rounded-full bg-gray-100 text-gray-700 block px-2 border-2 border-gray-700"
          >
            {{ $store.state.trash.items.length }}
          </span>
          <IconBase width="48" height="48">
            <IconRestore />
          </IconBase>
        </button>
      </div>
      <Timer v-for="item in items" :key="item.id" v-bind="item" />
    </div>
    <div class="mt-4" v-if="$store.state.settings.showSum">
      Stoppuhren: {{ sum() }}
    </div>
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
        .filter((item) => (item.type || 0) === 0)
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
    addTimer(event, type = 0) {
      if (this.$store.state.settings.pauseOthersOnResume && !event.metaKey) {
        this.$store.dispatch('pauseAll')
      }
      this.$store.commit('add', type)
    },
  },
}
</script>
