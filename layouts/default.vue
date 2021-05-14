<template>
  <div>
    <header class="flex bg-gray-900 py-2 px-4">
      <h1 class="text-2xl py-4">
        <NuxtLink to="/">Timetracker</NuxtLink>
      </h1>
      <nav class="flex ml-auto">
        <NuxtLink
          v-for="(navItem, i) in nav"
          :key="i"
          :to="navItem.to"
          :title="navItem.title"
          class="p-4 hover:bg-gray-800"
        >
          <IconBase v-if="navItem.icon" width="32" height="32">
            <Component :is="navItem.icon" />
          </IconBase>
          {{ navItem.label }}
        </NuxtLink>
      </nav>
    </header>
    <div class="p-4">
      <Nuxt />
      <ul
        class="mt-4 -mx-4 text-sm border-t border-top border-gray-700 text-gray-500 flex flex-wrap"
      >
        <li class="mt-3 px-4">
          <a href="https://paypal.me/jontro" target="_blank">
            Spendier' mir ein Bier
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nav: [
        {
          to: '/settings',
          title: 'Einstellungen',
          label: '',
          icon: 'IconSettings',
        },
      ],
    }
  },
  head() {
    return {
      bodyAttrs: {
        class: 'bg-gray-800 text-gray-100',
      },
      link: [
        {
          hid: 'icon',
          rel: 'icon',
          type: 'image/svg',
          href: this.$store.getters.isAnyRunning
            ? 'running.svg'
            : 'favicon.svg',
        },
      ],
    }
  },
}
</script>
