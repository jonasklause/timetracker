<template>
  <div>
    <h2 class="text-4xl mb-6">Verlauf</h2>
    <div v-for="(dateEntries, date) in entries" :key="date" class="mb-4">
      <h3 class="text-2xl mb-2">{{ date }}</h3>
      <ul>
        <li v-for="(entry, index) in dateEntries" :key="index">
          {{ formatDate(entry.time) }} - {{ entry.text }}
        </li>
      </ul>
    </div>
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
  },
  methods: {
    formatDate(value) {
      const date = new Date(value)
      return date.toLocaleTimeString()
    },
  },
}
</script>
