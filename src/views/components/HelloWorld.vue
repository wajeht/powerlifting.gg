<script setup>
import { ref } from 'vue';

const count = ref(0);

</script>

<template>
  <div>
    <h1>{{ count }}</h1>
    <button @click="count++">click</button>
  </div>
</template>
