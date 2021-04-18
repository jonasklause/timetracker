<template>
  <div class="p-4">
    <div class="grid gap-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2">
      <button
        class="bg-gray-700 w-full text-center text-7xl pt-2 pb-3"
        @click="addTimer"
      >
        +
      </button>
      <Timer v-for="item in items" :key="item.id" v-bind="item" />
    </div>
    <NuxtChild />
  </div>
</template>

<script>
export default {
  head() {
    return {
      bodyAttrs: {
        class: 'bg-gray-800 text-gray-200',
      },
      link: [
        {
          rel: 'icon',
          type: 'image/svg',
          href: this.$store.getters.isAnyRunning
            ? '/running.svg'
            : '/favicon.svg',
        },
      ],
    }
  },
  computed: {
    items() {
      return this.$store.state.items
    },
  },
  methods: {
    addTimer() {
      this.$store.dispatch('pauseAll')
      this.$store.commit('add')
    },
  },
}
</script>
