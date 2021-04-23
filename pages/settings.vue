<template>
  <div class="max-w-xl mx-auto">
    <h2 class="text-4xl mb-6">Einstellungen</h2>
    <label v-for="(field, key) in settings" :key="key" class="block mb-6">
      <Control
        v-bind="field"
        :setting-key="key"
        class="float-right mt-1 w-12 text-right"
      />
      <div>{{ field.label }}</div>
      <div v-if="field.description" class="text-gray-400 text-sm">
        {{ field.description }}
      </div>
    </label>
  </div>
</template>

<script>
export default {
  computed: {
    settings() {
      return {
        startAt: {
          type: 'Text',
          label: 'Start bei',
          description:
            'Jeder neue Timer startet nicht mehr bei 0 sondern bei dem angegebenen Wert.',
        },
        pauseOthersOnResume: {
          type: 'Checkbox',
          label: 'Andere Timer pausieren',
          description:
            'Sobald ein neuer Timer gestartet oder fortgesetzt wird, werden alle anderen pausiert.',
        },
      }
    },
  },
}
</script>
