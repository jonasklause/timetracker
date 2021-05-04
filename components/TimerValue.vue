<template>
  <input
    class="p-2 text-4xl text-center bg-transparent block w-full font-mono"
    :value="time() | timeFormat"
    @focus="focus = true"
    @blur="focus = false"
    @click="$event.target.select()"
    @change="updateTime"
  />
</template>

<script>
import timeSum from '../lib/timeSum.js'
import timeFormat from '../lib/timeFormat.js'
import timeParse from '../lib/timeParse.js'

export default {
  updateInterval: null,
  props: {
    id: {
      type: Number,
      default: 0,
    },
    resumedAt: {
      type: Number,
      default: 0,
    },
    pausedWith: {
      type: Number,
      default: 0,
    },
    label: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      focus: false,
    }
  },
  watch: {
    resumedAt(running) {
      this.toggleInterval(running)
    },
  },
  mounted() {
    this.toggleInterval(this.resumedAt)
  },
  beforeDestroy() {
    this.toggleInterval(false)
  },
  methods: {
    time() {
      return timeSum(this.pausedWith, this.resumedAt, this.label)
    },
    toggleInterval(active) {
      if (!active && this.$options.updateInterval) {
        clearInterval(this.$options.updateInterval)
      } else if (active) {
        this.$options.updateInterval = setInterval(() => {
          if (!this.focus) {
            this.$forceUpdate()
          }
        }, 1000)
      }
    },
    updateTime(event) {
      const newTime = timeParse(event.target.value)
      const oldTime = this.time()
      if (newTime !== false) {
        this.$store.commit('updateTime', {
          id: this.id,
          time: newTime,
          absolute: true,
        })
        this.$store.commit('history/addEntry', {
          type: 'timer/item/updateTime',
          text: `updated time #${this.id} ${oldTime} -> ${timeFormat(newTime)}`,
        })
      } else {
        this.$forceUpdate()
      }
    },
  },
}
</script>
