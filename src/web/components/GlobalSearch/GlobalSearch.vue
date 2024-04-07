<script setup>
import axios from 'axios';
import { nextTick, reactive, ref, onMounted, computed } from 'vue';

const states = reactive({
	search: '',
	data: [],
	open: false,
});

const inputRef = ref(null);

document.addEventListener('click', (event) => {
	const searchModal = document.getElementById('search-modal');
	if (searchModal && !searchModal.contains(event.target)) {
		states.open = false;
		states.search = '';
	}
});

window.addEventListener('keydown', function (event) {
	// ctrl + k
	if (event.ctrlKey && event.key === 'k') {
		states.open = true;
		nextTick(() => inputRef.value.focus());
	}

	// cmd + k
	if (event.metaKey && event.key === 'k') {
		states.open = true;
		nextTick(() => inputRef.value.focus());
	}

	// esc
	if (event.key === 'Escape') {
		states.open = false;
		states.search = '';
	}
});

function search() {
	window.location.href = `${window.location.origin}/search?q=${states.search}`;
}

async function getAllCoaches() {
	try {
		const response = await axios.get('/api/tenants');
		return response.data.data;
	} catch (error) {
		return [];
	}
}

onMounted(async () => {
	states.data = await getAllCoaches();
});

const computedSearchedData = computed(() => {
	return states.data.filter((tenant) => {
		const searchContent = tenant.name + ' ' + tenant.slug;
		return searchContent.toLowerCase().includes(states.search.toLowerCase());
	});
});

function computedDomain(slug) {
	const { protocol, hostname } = window.location;
	return `${protocol}//${slug}.${hostname}`;
}
</script>

<template>
	<div
		v-if="states.open"
		class="absolute h-screen w-screen bg-black/30 backdrop-blur-sm top-0 left-0 z-10"
	>
		<div
			id="search-modal"
			class="flex flex-col relative mx-auto max-w-lg bg-white top-1/4 rounded-md shadow-md"
		>
			<!-- input -->
			<div class="p-5">
				<label class="input input-bordered flex items-center gap-2">
					<input
						ref="inputRef"
						type="text"
						class="grow"
						v-model="states.search"
						@keydown.enter="search"
						placeholder="Search for a coach or a systems..."
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
			</div>

			<div class="px-5 py-4 max-h-sm overflow-y-scroll bg-[#E8E9EA]">
				<!-- searched -->
				<ul v-if="computedSearchedData.length && states.search.length" class="flex flex-col gap-2">
					<li
						class="p-3 shadow-sm bg-white rounded-md hover:bg-neutral hover:text-white"
						v-for="(tenant, idx) in computedSearchedData"
						:key="tenant.id"
					>
						<a class="flex gap-2" :href="computedDomain(tenant.slug)">
							<div class="p-3" :class="`bg-[${tenant.color}]`">{{ tenant.emoji }}</div>
							<p>{{ tenant.name }}</p>
						</a>
					</li>
				</ul>

				<!-- empty -->
				<div v-if="!states.search.length" class="text-center text-neutral-400 text-sm py-10">
					<span class="text-sm">No recent searches</span>
				</div>

				<!-- not found -->
				<div
					v-if="!computedSearchedData.length && states.search.length"
					class="text-center text-neutral-400 text-sm py-10"
				>
					<span class="text-sm"
						>No resutls for <span class="font-bold">{{ `"${states.search}"` }}</span></span
					>
				</div>
			</div>

			<!-- footer -->
			<div class="border-t border-1 border-solid text-center p-5">
				press <kbd class="kbd kbd-sm">esc</kbd> to close.
			</div>
		</div>
	</div>
</template>
