<template>
  <div>
    <input
      v-if="type === 'Text'"
      v-model.lazy="value"
      type="text"
      class="block w-16 bg-transparent border-gray-200 border rounded-md p-1 text-center"
    />
    <label
      v-if="type === 'Checkbox'"
      class="w-8 block border-gray-200 border rounded-xl p-1 box-content"
      :class="value ? 'bg-green-700' : ''"
    >
      <input
        v-model="value"
        type="checkbox"
        class="w-4 h-4 block appearance-none rounded-lg bg-gray-500 checked:bg-gray-200 checked:ml-4 transition-all"
      />
    </label>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    settingKey: {
      type: String,
      default: '',
    },
    config: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    value: {
      get() {
        const state = this.$store.state
        let value = state.settings[this.settingKey] || ''
        value = this.config && this.config.get ? this.config.get(value) : value
        return value
      },
      set(value) {
        if (this.config && this.config.set) {
          value = this.config.set(value)
        }
        this.$store.commit('settings/set', {
          key: this.settingKey,
          value,
        })
      },
    },
  },
}
</script>
