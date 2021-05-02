<template>
  <div
    class="bg-gray-700 text-center grid grid-cols-2"
    :class="[isRunning ? 'bg-green-900' : 'bg-gray-700']"
  >
    <div class="id text-left text-gray-500 text-xs p-2">#{{ id }}</div>
    <ul class="text-right flex justify-end">
      <li class="relative">
        <button class="p-2" title="Zeit verschieben" @click="transfer">
          <IconBase width="20" height="20">
            <IconTransfer />
          </IconBase>
        </button>
      </li>
      <li>
        <button class="p-2" title="Löschen" @click="remove">
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
        :title="isRunning ? 'Pause' : 'Fortsetzen'"
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
        @change="updateTime"
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
    resumedAt: {
      type: Number,
      default: 0,
    },
    pausedWith: {
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
      return this.resumedAt > 0
    },
  },
  watch: {
    resumedAt(running) {
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
      const time = timeSum(this.pausedWith, this.resumedAt)
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
        text: `resumed #${this.id} (${this.time()})`,
      })
      const exclusive = settings.pauseOthersOnResume && !event.metaKey
      this.$store.dispatch('resume', { id: this.id, exclusive })
    },
    pause() {
      this.$store.commit('history/addEntry', {
        type: 'timer/item/pause',
        text: `paused #${this.id} (${this.time()})`,
      })
      this.$store.commit('pause', this.id)
    },
    toggle(event) {
      this.isRunning ? this.pause(event) : this.resume(event)
    },
    remove() {
      this.$store.commit('history/addEntry', {
        type: 'timer/item/removed',
        text: `removed #${this.id} "${this.label}" (${this.time()})`,
      })
      this.$store.commit('remove', this.id)
    },
    transfer() {
      this.$store.commit('transfer/setSource', this.id)
      this.$router.push({ path: '/transfer' })
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
            text: `updated label #${this.id} "${oldLabel}" -> "${value}"`,
          })
        }
      }, 1000)
    },
  },
}
</script>
