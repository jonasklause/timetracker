<template>
  <div
    class="bg-gray-700 text-center grid grid-cols-2"
    :class="[isRunning ? 'bg-green-900' : 'bg-gray-700']"
  >
    <div class="id text-left text-gray-500 text-xs p-2">#{{ id }}</div>
    <ul class="text-right flex justify-end">
      <li>
        <button class="p-2" title="Delete" @click="remove">DE</button>
      </li>
      <li class="relative">
        <NuxtLink
          to="/transfer"
          class="inline-block p-2"
          title="Transfer to another timer"
        >
          TR
        </NuxtLink>
      </li>
    </ul>
    <div class="col-span-2">
      <input
        ref="label"
        :value="label"
        class="p-1 text-center bg-transparent block w-full"
        @input="updateLabel($event.target.value)"
      />
    </div>
    <div class="col-span-2 text-left">
      <button
        class="absolute p-4"
        :class="{ 'text-red-500': isRunning }"
        @click="toggle"
      >
        <IconBase width="24" height="24">
          <Component :is="isRunning ? 'IconRecording' : 'IconPause'" />
        </IconBase>
      </button>
      <input
        class="p-2 text-4xl text-center bg-transparent block w-full font-mono"
        :value="time(true)"
        @focus="focus = 'TIME'"
        @blur="focus = null"
        @click="$event.target.select()"
        @change="updateTime($event.target.value)"
      />
    </div>
  </div>
</template>

<script>
import timeSum from '../lib/timeSum.js'
import timeFormat from '../lib/timeFormat.js'
import timeParse from '../lib/timeParse.js'

export default {
  props: {
    id: {
      type: Number,
      default: 0,
    },
    label: {
      type: String,
      default: '',
    },
    resumed_at: {
      type: Number,
      default: 0,
    },
    paused_with: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      interval: null,
      focus: null,
    }
  },
  computed: {
    isRunning() {
      return this.resumed_at > 0
    },
  },
  watch: {
    resumed_at(running) {
      this.renderInterval(running)
    },
  },
  mounted() {
    this.renderInterval(this.isRunning)
    this.label || this.$refs.label.focus()
  },
  beforeDestroy() {
    this.renderInterval(false)
  },
  methods: {
    time(format) {
      const time = timeSum(this.paused_with, this.resumed_at)
      if (format) {
        return timeFormat(time)
      }
      return time
    },
    renderInterval(start) {
      if (!start && this.interval) {
        clearInterval(this.interval)
      } else if (start) {
        this.interval = setInterval(() => {
          if (this.focus !== 'TIME') {
            this.$forceUpdate()
          }
        }, 1000)
      }
    },
    resume() {
      this.$store.dispatch('resume', { id: this.id, exclusive: true })
    },
    pause() {
      this.$store.commit('pause', this.id)
    },
    toggle() {
      this.isRunning ? this.pause() : this.resume()
    },
    remove() {
      console.info(
        `Removed Timer #${this.id} "${this.label}" (${this.formattedTime})`
      )
      this.$store.commit('remove', this.id)
    },
    updateTime(value) {
      const newTime = timeParse(value)
      if (newTime !== false) {
        this.$store.commit('updateTime', {
          id: this.id,
          time: newTime,
          absolute: true,
        })
      }
    },
    updateLabel(value) {
      this.$store.commit('update', {
        id: this.id,
        label: value,
      })
    },
  },
}
</script>

<style>
.time.running::before {
  content: '●';
  position: absolute;
  margin-left: 0.5rem;
  line-height: 3.5rem;
  font-size: 1rem;
  color: red;
}
</style>
