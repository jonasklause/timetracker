<template>
  <div
    class="bg-gray-700 text-center grid grid-cols-2"
    :class="[resumedAt ? 'bg-green-900' : 'bg-gray-700']"
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
        :value="label"
        class="p-1 text-center bg-transparent block w-full"
        @change="updateLabel"
      />
    </div>
    <div class="col-span-2 text-left">
      <button
        class="absolute p-4"
        :title="resumedAt ? 'Pause' : 'Fortsetzen'"
        @click="toggle"
      >
        <IconBase width="24" height="24">
          <Component :is="resumedAt ? 'IconPause' : 'IconPlay'" />
        </IconBase>
      </button>
      <TimerValue v-bind="{ id, label, resumedAt, pausedWith }" />
    </div>
  </div>
</template>

<script>
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
    resumedAt: {
      type: Number,
      default: 0,
    },
    pausedWith: {
      type: Number,
      default: 0,
    },
  },
  mounted() {
    this.label || this.$refs.label.focus()
  },
  methods: {
    resume(event) {
      const settings = this.$store.state.settings
      this.$store.commit('history/addEntry', {
        type: 'timer/item/resume',
        text: `resumed #${this.id}`,
      })
      const exclusive = settings.pauseOthersOnResume && !event.metaKey
      this.$store.dispatch('resume', { id: this.id, exclusive })
    },
    pause() {
      this.$store.commit('history/addEntry', {
        type: 'timer/item/pause',
        text: `paused #${this.id}`,
      })
      this.$store.commit('pause', this.id)
    },
    toggle(event) {
      this.resumedAt ? this.pause(event) : this.resume(event)
    },
    remove() {
      this.$store.commit('history/addEntry', {
        type: 'timer/item/removed',
        text: `removed #${this.id} "${this.label}"`,
      })
      this.$store.commit('remove', this.id)
    },
    transfer() {
      this.$store.commit('transfer/setSource', this.id)
      this.$router.push({ path: '/transfer' })
    },
    updateLabel(event) {
      const value = event.target.value
      const oldLabel = this.label
      this.$store.commit('update', {
        id: this.id,
        label: value,
      })
      this.$store.commit('history/addEntry', {
        type: 'timer/item/updateLabel',
        text: `updated label #${this.id} "${oldLabel}" -> "${value}"`,
      })
    },
  },
}
</script>
