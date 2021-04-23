<template>
  <div
    class="bg-gray-700 text-center grid grid-cols-2"
    :class="[isRunning ? 'bg-green-900' : 'bg-gray-700']"
  >
    <div class="id text-left text-gray-500 text-xs p-2">#{{ id }}</div>
    <ul class="text-right flex justify-end">
      <li class="relative">
        <NuxtLink
          to="/transfer"
          class="inline-block p-2"
          title="Transfer to another timer"
        >
          <IconBase width="20" height="20">
            <IconTransfer />
          </IconBase>
        </NuxtLink>
      </li>
      <li>
        <button class="p-2 text-3xl" title="Delete" @click="remove">
          <IconBase width="20" height="20">
            <IconDelete />
          </IconBase>
        </button>
      </li>
    </ul>
    <div class="col-span-2">
      <input
        ref="label"
        :value="tempLabel || label"
        class="p-1 text-center bg-transparent block w-full"
        @input="updateLabel($event.target.value)"
      />
    </div>
    <div class="col-span-2 text-left">
      <button
        class="absolute p-4"
        :title="isRunning ? 'Pause' : 'Resume'"
        @click="toggle"
      >
        <IconBase width="24" height="24">
          <Component :is="isRunning ? 'IconPause' : 'IconPlay'" />
        </IconBase>
      </button>
      <input
        class="p-2 text-4xl text-center bg-transparent block w-full font-mono"
        :value="time()"
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
  timeUpdateInterval: null,
  labelUpdateTimeout: null,
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
      tempLabel: '',
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
    time(noFormat) {
      const time = timeSum(this.paused_with, this.resumed_at)
      if (noFormat) {
        return time
      }
      return timeFormat(time)
    },
    renderInterval(start) {
      if (!start && this.$options.timeUpdateInterval) {
        clearInterval(this.$options.timeUpdateInterval)
      } else if (start) {
        this.$options.timeUpdateInterval = setInterval(() => {
          if (this.focus !== 'TIME') {
            this.$forceUpdate()
          }
        }, 1000)
      }
    },
    resume(event) {
      const settings = this.$store.state.settings
      this.$store.commit('history/addEntry', {
        type: 'timer/item/resume',
        text: `#${this.id} resumed with ${this.time()}`,
      })
      const exclusive = settings.pauseOthersOnResume && !event.metaKey
      this.$store.dispatch('resume', { id: this.id, exclusive })
    },
    pause() {
      this.$store.commit('history/addEntry', {
        type: 'timer/item/pause',
        text: `timer #${this.id} paused with ${this.time()}`,
      })
      this.$store.commit('pause', this.id)
    },
    toggle(event) {
      this.isRunning ? this.pause(event) : this.resume(event)
    },
    remove() {
      this.$store.commit('history/addEntry', {
        type: 'timer/item/removed',
        text: `timer #${this.id} removed with ${this.time()}`,
      })
      this.$store.commit('remove', this.id)
    },
    updateTime(value) {
      const newTime = timeParse(value)
      const oldTime = this.time()
      if (newTime !== false) {
        this.$store.commit('updateTime', {
          id: this.id,
          time: newTime,
          absolute: true,
        })
        this.$store.commit('history/addEntry', {
          type: 'timer/item/updateTime',
          text: `timer #${this.id} updated time ${oldTime} -> ${timeFormat(
            newTime
          )}`,
        })
      }
    },
    updateLabel(value) {
      const oldLabel = this.label
      this.tempLabel = value
      clearTimeout(this.$options.labelUpdateTimeout)
      this.$options.labelUpdateTimeout = setTimeout(() => {
        this.tempLabel = ''
        if (oldLabel !== value) {
          this.$store.commit('update', {
            id: this.id,
            label: value,
          })
          this.$store.commit('history/addEntry', {
            type: 'timer/item/updateLabel',
            text: `timer #${this.id} updated label "${oldLabel}" -> "${value}"`,
          })
        }
      }, 1000)
    },
  },
}
</script>
