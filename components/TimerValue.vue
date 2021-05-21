<template>
  <input
    class="text-4xl text-center bg-transparent block w-full font-mono"
    :value="time | timeFormat"
    @focus="focus = true"
    @blur="focus = false"
    @click="$event.target.select()"
    @change="updateTime"
  />
</template>

<script>
import timeSum from '../lib/timeSum.js'
import timeParse from '../lib/timeParse.js'

export default {
  updateInterval: null,
  props: {
    id: {
      type: Number,
      default: 0,
    },
    type: {
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
      time: timeSum(this.pausedWith, this.resumedAt, this.label),
    }
  },
  watch: {
    resumedAt(running) {
      this.toggleInterval(running)
    },
    time(newTime, oldTime) {
      if (Math.sign(newTime) !== Math.sign(oldTime)) {
        this.$emit('forceUpdate')
      }
    },
  },
  mounted() {
    this.toggleInterval(this.resumedAt)
  },
  beforeDestroy() {
    this.toggleInterval(false)
  },
  methods: {
    toggleInterval(active) {
      if (!active && this.$options.updateInterval) {
        clearInterval(this.$options.updateInterval)
      } else if (active) {
        this.$options.updateInterval = setInterval(() => {
          if (!this.focus) {
            this.time = timeSum(this.pausedWith, this.resumedAt, this.label)
            this.$forceUpdate()
          }
        }, 1000)
      }
    },
    updateTime(event) {
      let newTime = timeParse(event.target.value)
      if (newTime !== false) {
        if (this.type === 1) {
          this.$store.commit('update', {
            id: this.id,
            initValue: newTime,
          })
          newTime *= -1
        }
        this.time = newTime
        this.$store.commit('updateTime', {
          id: this.id,
          time: newTime,
          absolute: true,
        })
      } else {
        this.$forceUpdate()
      }
    },
  },
}
</script>
