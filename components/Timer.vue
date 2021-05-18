<template>
  <div class="bg-gray-700 text-center" :class="bgClass()">
    <div class="flex">
      <ul>
        <li>
          <button
            class="p-2"
            :title="resumedAt ? 'Pause' : 'Fortsetzen'"
            @click="toggle"
          >
            <IconBase width="20" height="20">
              <Component :is="resumedAt ? 'IconPause' : 'IconPlay'" />
            </IconBase>
          </button>
        </li>
      </ul>
      <div class="text-center mx-auto text-gray-400 text-xs p-2">
        #{{ id }} {{ typeName }}
      </div>
      <ul class="text-right flex justify-end">
        <li v-if="$store.state.settings.showTransferButtons && type === 0">
          <button class="p-2" title="Zeit umbuchen" @click="transfer">
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
    </div>
    <div>
      <TimerValue
        v-bind="{ id, label, resumedAt, pausedWith, type }"
        @forceUpdate="$forceUpdate()"
      />
    </div>
    <div class="">
      <input
        ref="label"
        :value="label"
        class="p-1 text-lg text-center bg-transparent block w-full"
        @change="updateLabel"
      />
    </div>
  </div>
</template>

<script>
import timeSum from '~/lib/timeSum'

export default {
  props: {
    id: {
      type: Number,
      default: 0,
    },
    type: {
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
  computed: {
    typeName() {
      if (this.type === 0) return 'Stoppuhr'
      if (this.type === 1) return 'Countdown'
      return undefined
    },
  },
  mounted() {
    this.label || this.$refs.label.focus()
  },
  methods: {
    resume(event) {
      const settings = this.$store.state.settings
      const exclusive = settings.pauseOthersOnResume && !event.metaKey
      this.$store.dispatch('resume', { id: this.id, exclusive })
    },
    pause() {
      this.$store.commit('pause', this.id)
    },
    toggle(event) {
      this.resumedAt ? this.pause(event) : this.resume(event)
    },
    remove() {
      this.$store.commit('remove', this.id)
    },
    transfer() {
      this.$store.commit('transfer/setSource', this.id)
      this.$router.push({ path: '/transfer' })
    },
    updateLabel(event) {
      const value = event.target.value
      this.$store.commit('update', {
        id: this.id,
        label: value,
      })
    },
    bgClass() {
      const time = timeSum(this.pausedWith, this.resumedAt, this.label)
      if (this.type === 1 && time > 0) return 'bg-red-900 animate-pulse'
      if (this.resumedAt) return 'bg-green-900'
      return 'bg-gray-700'
    },
  },
}
</script>
