<template>
  <div>
    <h2 class="mb-6">
      <button
        class="bg-gray-600 rounded inline-block p-2 float-right"
        @click="$store.commit('trash/clear')"
      >
        {{
          $store.state.trash.items.length
            ? `Papierkorb leeren (${$store.state.trash.items.length} Timer)`
            : '✓ Papierkorb leer'
        }}
      </button>
      <button class="focus:outline-none text-3xl" @click="open = !open">
        {{ open ? '▾' : '▸' }} Papierkorb
      </button>
    </h2>

    <p class="text-gray-400 text-sm mb-6">
      Über den Papierkorb können die zuletzt gelöschten Timer wieder hergestellt
      werden. Verfügbar sind immer die letzten 50 Timer. Wenn ein Timer zum
      Zeitpunkt des Lösches noch gelaufen ist, läuft er auch im Papierkorb
      weiter.
    </p>
    <div v-if="items.length && open">
      <button
        v-if="items.length > 1"
        class="inline-block px-2 py-1 mb-2 rounded-full text-sm text-gray-200 bg-gray-500"
        :class="
          selected.length === items.length ? 'bg-green-900' : 'bg-gray-700'
        "
        @click="toggleAll"
      >
        alle auswählen
      </button>
      <div v-for="item in items" :key="item.id">
        <label class="mb-1">
          <input
            :id="item.id"
            v-model="selected"
            :value="item.id"
            type="checkbox"
            class="sr-only"
          />
          <span
            class="inline-flex items-center rounded-full pr-2"
            :class="selected.includes(item.id) ? 'bg-gray-500' : ''"
          >
            <span
              class="p-1 mr-2 rounded-full text-sm"
              :class="
                selected.includes(item.id) ? 'bg-green-900' : 'bg-gray-700'
              "
            >
              <IconBase width="24" height="24">
                <Component :is="item.icon" />
              </IconBase>
            </span>
            {{ item.time | timeFormat }} {{ item.label ? '-' : '' }}
            {{ item.label }}
          </span>
        </label>
      </div>
      <button
        v-if="items.length > 5"
        class="inline-block px-2 py-1 mt-1 rounded-full text-sm text-gray-200 bg-gray-500"
        :class="
          selected.length === items.length ? 'bg-green-900' : 'bg-gray-700'
        "
        @click="toggleAll"
      >
        alle auswählen
      </button>
      <div class="mt-6">
        <button
          class="bg-gray-600 rounded p-2 mr-1 inline-flex items-center"
          @click="restoreSelected"
        >
          <div class="relative text-sm">
            <div
              class="absolute left-4 font-bold rounded-full bg-gray-100 text-gray-700 px-1 border-2 border-gray-700"
            >
              {{ selected.length }}
            </div>
            <IconBase width="36" height="36">
              <IconRestore />
            </IconBase>
          </div>
          <span class="ml-4">wiederherstellen</span>
        </button>
        <button
          class="bg-red-800 rounded p-2 mr-1 inline-flex items-center"
          @click="removeSelected"
        >
          <div class="relative text-sm py-1 pr-4">
            <div
              class="absolute left-6 top-0 font-bold rounded-full bg-gray-100 text-red-800 px-1 border-2 border-red-800"
            >
              {{ selected.length }}
            </div>
            <IconBase width="28" height="28">
              <IconDelete />
            </IconBase>
          </div>
          <span class="ml-4">löschen</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import timeSum from '~/lib/timeSum'
export default {
  data() {
    return {
      selected: [],
      open: false,
    }
  },
  computed: {
    items() {
      return this.$store.state.trash.items.map((item) => ({
        id: item.id,
        icon: item.type === 1 ? 'IconCountdown' : 'IconStoppwatch',
        label: item.label,
        time: timeSum(item.pausedWith, item.resumedAt, item.label),
      }))
    },
  },
  methods: {
    toggleAll() {
      this.selected =
        this.selected.length !== this.items.length
          ? this.items.map((i) => i.id)
          : []
    },
    removeSelected() {
      this.selected.forEach((i) => this.$store.commit('trash/remove', i))
      this.selected = []
    },
    restoreSelected() {
      this.selected.forEach((i) => this.$store.commit('restore', i))
      this.selected = []
    },
  },
}
</script>
