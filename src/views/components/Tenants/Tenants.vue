<script setup>
import { defineProps } from 'vue';
const props = defineProps({ tenants: Array });

function configureDomain(slug) {
  const host = window.location.host;
  const protocal = window.location.protocol;
  return `${protocal}//${slug}.${host}`;
}
</script>

<template>
  <div>
    <div v-for="tenant in props.tenants">
      <h4>{{ `${tenant.emoji} ${tenant.name}` }}</h4>
      <a :href="configureDomain(tenant.slug)">{{ tenant.slug }}</a>
    </div>
  </div>
</template>
