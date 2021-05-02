<template>
  <div>
    <div class="flex mb-2 -mx-1">
      <button
        v-for="(suggestion, index) in suggestions"
        :key="index"
        class="bg-gray-600 text-white py-1 px-2 mx-1 rounded-xl"
        @click="time = suggestion"
      >
        {{ suggestion | timeFormat(1) }}
      </button>
      <button
        class="bg-gray-600 text-white py-1 px-2 mx-1 rounded-xl"
        @click="time = maxTime"
      >
        Alles
      </button>
    </div>
    <div class="flex mb-2">
      <input v-model="time" class="flex-grow" type="range" :max="maxTime" />
      <input
        v-model.lazy="formattedTime"
        class="rounded bg-transparent border border-gray-400 p-1 w-28 text-center ml-2"
      />
    </div>
  </div>
</template>

<script>
import timeSum from '../../lib/timeSum.js'
import timeFormat from '../../lib/timeFormat.js'
import timeParse from '~/lib/timeParse.js'

export default {
  computed: {
    maxMinutes() {
      return parseInt(this.maxTime / (60 * 1000))
    },
    maxTime() {
      const sourceId = this.$store.state.transfer.sourceId
      const item = this.$store.getters.byId(sourceId)
      return timeSum(item.pausedWith, item.resumedAt)
    },
    suggestions() {
      return [5, 10, 15, 30, 60]
        .map((i) => i * 60000)
        .filter((i) => i < this.maxTime)
    },
    time: {
      get() {
        return this.$store.state.transfer.time
      },
      set(value) {
        this.$store.commit('transfer/setTime', parseInt(value))
      },
    },
    formattedTime: {
      get() {
        return timeFormat(this.time, 1)
      },
      set(value) {
        this.time = timeParse(value)
      },
    },
  },
  mounted() {
    this.time = Math.floor(this.maxTime / 120000) * 60000
  },
}
</script>
