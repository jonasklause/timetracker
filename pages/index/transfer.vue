<template>
  <div class="absolute top-20 w-full">
    <div
      class="w-96 mx-auto bg-gray-700 ring"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="options-menu"
    >
      <div class="text-right">
        <NuxtLink to="/" class="inline-block px-2 hover:bg-gray-600"
          >&times;</NuxtLink
        >
      </div>

      <div class="item-selection text-left" role="none">
        <a
          href="#"
          class="block px-4 py-1 text-sm hover:bg-gray-600"
          role="menuitem"
          >neuer Timer</a
        >
        <a
          v-for="item in $store.state.items"
          :key="item.id"
          href="#"
          class="block px-4 py-1 text-sm hover:bg-gray-600"
          role="menuitem"
          >#{{ item.id }} {{ item.label }}</a
        >
        <a
          href="#"
          class="block px-4 py-1 text-sm hover:bg-gray-600"
          role="menuitem"
          >entfernen</a
        >
      </div>

      <div class="timeSelection">
        <div class="flex p-2">
          <button
            v-for="(timeSuggest, index) in timeSuggestions"
            :key="index"
            class="hover:bg-gray-600 p-1 flex-grow"
            @click="time = timeSuggest"
          >
            {{ timeSuggest }}m
          </button>
        </div>
        <div class="flex p-2">
          <input v-model="time" class="flex-grow" type="range" />
          <input
            v-model="time"
            class="bg-transparent border-2 border-gray-400 p-1 w-12 text-center ml-2"
          />
        </div>
        <div class="text-right">
          <button class="bg-green-700 hover:bg-green-800 p-1 block w-full">
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import timeSum from '../lib/timeSum.js'
// import timeFormat from '../lib/timeFormat.js'

export default {
  props: {
    maxTime: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      time: this.maxTime,
      targetItem: null,
      timeSuggestions: [1, 5, 10, 20, 45],
    }
  },
}
</script>
