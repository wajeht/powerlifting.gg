<script setup>
import { defineProps, computed, cloneVNode } from 'vue';
const props = defineProps({ users: Array });

const computedDomain = computed(() => {
  return window.location.origin;
});
</script>

<template>
  <div class="flex flex-col gap-5">
    <a v-for="user of props.users" :href="`${computedDomain}/user/${user.id}`" :key="`user-key-${user.id}`"
      class="bg-neutral-200 hover:bg-neutral-300 p-5 rounded-md">
      <h4><span class="font-bold">ID:</span> {{ user.id }}</h4>
      <p><span class="font-bold">Email:</span>{{ user.email }}</p>
      <p><span class="font-bold">Role:</span>{{ user.role }}</p>
    </a>
  </div>
</template>
