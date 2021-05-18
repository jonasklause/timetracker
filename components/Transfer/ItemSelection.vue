<template>
  <div class="flex flex-wrap -m-1" role="none">
    <button
      v-for="(item, i) in items"
      :key="i"
      :class="target == item.id ? 'bg-gray-400' : 'bg-gray-600'"
      class="block rounded text-white m-1 p-2 text-sm"
      @click="target = item.id"
    >
      <span>#{{ item.id }}</span>
      <span>{{ item.label }}</span>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    maxTime: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    items() {
      return this.$store.state.items.filter(
        (item) =>
          item.type === 0 && item.id !== this.$store.state.transfer.sourceId
      )
    },
    target: {
      get() {
        return this.$store.state.transfer.targetId
      },
      set(value) {
        this.$store.commit('transfer/setTarget', value)
      },
    },
  },
  mounted() {
    this.target = null
  },
}
</script>
