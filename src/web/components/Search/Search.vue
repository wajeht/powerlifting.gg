<script setup>
import axios from 'axios';
import { reactive } from 'vue';

const states = reactive({
	loading: false,
	search: '',
	data: [],
	searchModalOpen: false,
});

let timeout;

function computedDomain(slug) {
	const { protocol, hostname } = window.location;
	return `${protocol}//${slug}.${hostname}`;
}

function debounce(func, delay) {
	clearTimeout(timeout);
	timeout = setTimeout(func, delay);
}

function search() {
	window.location.href = `${window.location.origin}/search?q=${states.search}`;
}

async function fetchData() {
	states.loading = true;
	try {
		if (states.search === '') {
			states.data = [];
			return;
		}
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
		<label class="input input-bordered flex items-center gap-2 w-[374px]">
			<input
				type="text"
				class="grow"
				autofocus
				v-model="states.search"
				placeholder="Search for a coach or a systems..."
				@keydown.enter="search"
				@input="debounce(fetchData, 500)"
			/>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 16 16"
				fill="currentColor"
				class="w-4 h-4 opacity-70"
			>
				<path
					fill-rule="evenodd"
					d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
					clip-rule="evenodd"
				/>
			</svg>
		</label>

		<ul
			v-if="states.data.length"
			class="menu absolute top-[55px] w-[374px] rounded-md shadow-md bg-white"
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
