<script setup>
import { computed, onMounted, reactive } from 'vue';

onMounted(() => {
	console.log('xxxx');
	console.log('xxxx');
});
</script>

<template>
	<div class="flex gap-1 w-full items-center justify-center">
		<input
			type="text"
			placeholder="Search for a coach or a system..."
			class="input input-bordered w-full max-w-[18rem]"
		/>
		<button class="btn btn-neutral">Search</button>
	</div>
</template>
