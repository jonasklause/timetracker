<template>
  <div class="max-w-xl mx-auto">
    <button
      v-if="hasEntries"
      class="float-right text-white bg-gray-600 p-2 rounded"
      @click="$store.commit('history/clear')"
    >
      Verlauf leeren
    </button>
    <h2 class="text-4xl mb-2">Verlauf</h2>
    <p class="text-gray-400 mb-4">
      Im Verlauf werden die letzten 100 Aktionen gespeichert.
    </p>
    <div v-for="(dateEntries, date) in entries" :key="date" class="mb-6">
      <h3 class="text-2xl mb-2">{{ date }}</h3>
      <ul>
        <li
          v-for="(entry, index) in dateEntries"
          :key="index"
          class="flex mb-2 text-sm"
        >
          <span class="w-16 flex-shrink-0 flex-grow-0">{{
            formatDate(entry.time)
          }}</span>
          <span class="">{{ entry.text }}</span>
        </li>
      </ul>
    </div>
    <p v-if="!hasEntries">Keine Einträge vorhanden</p>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  computed: {
    entries() {
      const entries = this.$store.state.history.entries
      return _.groupBy(entries, (entry) =>
        new Date(entry.time).toLocaleDateString()
      )
    },
    hasEntries() {
      return Object.keys(this.entries).length
    },
  },
  methods: {
    formatDate(value) {
      const date = new Date(value)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
  },
}
</script>
