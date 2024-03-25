<script setup>
import { defineProps, computed, cloneVNode } from 'vue';
const props = defineProps({ users: Array });

const computedDomain = computed(() => {
  return window.location.origin;
});
</script>

<template>
  <div class="flex flex-col gap-5">
    <a v-for="user of props.users" :href="`${computedDomain}/user/${user.username}`" :key="`user-key-${user.id}`"
      class="bg-neutral-200 hover:bg-neutral-300 p-5 rounded-md">
      <h4 class="font-bold">{{ user.emoji }}</h4>
      <h4 class="font-bold">{{ user.username }}</h4>
      <p>{{ user.email }}</p>
      <p>{{ user.role }}</p>
    </a>
  </div>
</template>
