<template>
  <div class="max-w-xl mx-auto">
    <h2 class="text-4xl mb-6">Einstellungen</h2>
    <label
      v-for="(field, key) in settings"
      :key="key"
      class="flex items-center mb-6"
    >
      <div class="flex-grow">
        <div>{{ field.label }}</div>
        <div v-if="field.description" class="text-gray-400 text-sm">
          {{ field.description }}
        </div>
      </div>

      <Control
        v-bind="field"
        :setting-key="key"
        class="ml-6 w-16 text-right flex-shrink-0"
      />
    </label>
  </div>
</template>

<script>
import timeFormat from '../lib/timeFormat.js'
import timeParse from '../lib/timeParse.js'

export default {
  computed: {
    settings() {
      return {
        startAt: {
          type: 'Text',
          label: 'Start bei',
          description:
            'Jeder neue Timer startet nicht mehr bei 0 sondern bei dem angegebenen Wert.',
          config: {
            get: (value) => timeFormat(value, 1),
            set: (value) => timeParse(value),
          },
        },
        pauseOthersOnResume: {
          type: 'Checkbox',
          label: 'Andere Timer pausieren',
          description:
            'Sobald ein neuer Timer gestartet oder fortgesetzt wird, werden alle anderen pausiert. Alternativ kann beim Starten eines Timers  Command (Mac) bzw. Strg (Windows) gedrückt werden, um mehrere Timer gleichzeitig laufen zu lassen.',
        },
      }
    },
  },
}
</script>
