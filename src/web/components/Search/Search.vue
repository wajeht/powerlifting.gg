<script setup>
import axios from 'axios';
import { reactive } from 'vue';

const states = reactive({
	loading: false,
	search: '',
	data: [],
});

function computedDomain(slug) {
	const { protocol, hostname } = window.location;
	return `${protocol}//${slug}.${hostname}`;
}

async function fetchData() {
	states.loading = true;
	try {
		const response = await axios.get(`/api/search?q=${encodeURIComponent(states.search)}`);
		states.data = response.data.data;
	} catch (error) {
		console.error('Error fetching data:', error);
	} finally {
		states.loading = false;
	}
}
</script>

<template>
	<div class="flex gap-1 items-center justify-center relative w-[374px]">
		<input
			type="text"
			v-model="states.search"
			placeholder="Search for a coach or a system..."
			class="input input-bordered w-full max-w-[18rem]"
			:disabled="states.loading"
		/>
		<button @click="fetchData" class="btn btn-neutral" :disabled="states.loading">
			<span v-if="!states.loading">Search</span>
			<span v-if="states.loading">...........</span>
		</button>

		<ul
			v-if="states.data.length"
			class="menu absolute top-[55px] w-[374px] bg-neutral-100 rounded-sm"
		>
			<li class="flex flex-col gap-2" v-for="tenant in states.data" :key="tenant.id">
				<a :href="computedDomain(tenant.slug)">
					<div class="p-3" :class="`bg-[${tenant.color}]`">{{ tenant.emoji }}</div>
					<p>{{ tenant.name }}</p>
				</a>
			</li>
		</ul>
	</div>
</template>
