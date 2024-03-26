<script setup>
import axios from '../../../../public/js/axios.min.js';
import { computed, onMounted, reactive } from 'vue';

const states = reactive({
	users: [],
});

const computedDomain = computed(() => {
	return window.location.origin;
});

onMounted(async () => {
	const { data } = await axios.get('/api/users');
	states.users = data.data;
});
</script>

<template>
	<div data-testid="hi" class="flex flex-col gap-5">
		<a
			v-for="user of states.users"
			:href="`${computedDomain}/user/${user.username}`"
			:key="`user-key-${user.id}`"
			class="bg-neutral-200 hover:bg-neutral-300 p-5 rounded-md"
		>
			<h4 class="font-bold">{{ user.emoji }}</h4>
			<h4 class="font-bold">{{ user.username }}</h4>
			<p>{{ user.email }}</p>
			<p>{{ user.role }}</p>
		</a>
	</div>
</template>
