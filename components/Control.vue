<template>
  <div>
    <input
      v-if="type === 'Text'"
      v-model.lazy="value"
      type="text"
      class="block w-full bg-transparent border-gray-200 border rounded-md p-1 text-center"
    />
    <input
      v-if="type === 'Checkbox'"
      v-model="value"
      type="checkbox"
      class="w-4 h-4 text-right"
    />
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
