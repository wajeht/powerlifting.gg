<script setup>
import axios from 'axios';
import { nextTick, reactive, ref, onMounted, computed, watch } from 'vue';

const backdropRef = ref(null);
const modalRef = ref(null);

const states = reactive({
	search: '',
	data: [],
	open: false,
	selectedIndex: null,
});

const inputRef = ref(null);

// remove modal on click outside of modal
document.addEventListener('click', (event) => {
	const searchModal = document.getElementById('modal');
	if (searchModal && !searchModal.contains(event.target)) {
		states.open = false;
		states.search = '';
		states.selectedIndex = null;
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
		if (backdropRef.value || modalRef.value) {
			backdropRef.value.classList.add('animate__fadeOut');
			modalRef.value.classList.add('animate__zoomOut');
			setTimeout(() => {
				states.open = false;
				states.search = '';
				states.selectedIndex = null;
			}, 250);
		}
	}

	// select searched items with arrow key
	if (states.open && ['ArrowUp', 'ArrowDown'].includes(event.key)) {
		event.preventDefault();
		const currentIndex = states.selectedIndex !== null ? states.selectedIndex : -1;
		if (event.key === 'ArrowUp') {
			states.selectedIndex = Math.max(currentIndex - 1, 0);
			scrollIntoViewIfNeeded();
		} else if (event.key === 'ArrowDown') {
			states.selectedIndex = Math.min(currentIndex + 1, computedSearchedData.value.length - 1);
			scrollIntoViewIfNeeded();
		}
	}

	function scrollIntoViewIfNeeded() {
		const selectedItem = document.querySelector('.selected');

		if (selectedItem) {
			const container = selectedItem.parentElement.parentElement;
			const selectedItemRect = selectedItem.getBoundingClientRect();
			const containerRect = container.getBoundingClientRect();
			const itemHeight = selectedItem.offsetHeight + 216;

			if (selectedItemRect.bottom > containerRect.bottom) {
				container.scrollBy(0, itemHeight);
			} else if (selectedItemRect.top < containerRect.top) {
				container.scrollBy(0, -itemHeight);
			}
		}
	}

	// go to selected item on enter
	if (event.key === 'Enter' && states.selectedIndex !== null) {
		event.preventDefault();
		const selectedSlug = computedSearchedData.value[states.selectedIndex].slug;
		go(selectedSlug);
	}
});

function search() {
	if (states.search === '') return;

	const { protocol, hostname } = window.location;

	const pagination = `current_page=1&per_page=25&sort=asc`;

	// app.test
	if (hostname.split('.').length === 2) {
		window.location.href = `${window.location.origin}/search?q=${states.search}&${pagination}`;
		return;
	}

	// sub.app.test
	if (hostname.split('.').length === 3) {
		const [_, domain, tld] = hostname.split('.');
		window.location.href = `${protocol}//${domain}.${tld}/search?q=${states.search}&${pagination}`;
		return;
	}
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
	setTimeout(async () => {
		states.data = await getAllCoaches();
	}, 500);
});

const computedSearchedData = computed(() => {
	return states.data.filter((tenant) => {
		const searchContent = tenant.name + ' ' + tenant.slug;
		return searchContent.toLowerCase().includes(states.search.toLowerCase());
	});
});

// reset arrow position after selecting on diff searches
watch(
	() => states.search,
	(curr, prev) => {
		if (curr !== prev) {
			states.selectedIndex = null;
		}
	},
);

function computedDomain(slug) {
	const { protocol, hostname } = window.location;
	return `${protocol}//${slug}.${hostname}`;
}

function go(slug) {
	const { protocol, hostname } = window.location;

	// app.test
	if (hostname.split('.').length === 2) {
		const url = `${protocol}//${slug}.${hostname}`;
		window.location.href = url;
	}

	// sub.app.test
	if (hostname.split('.').length === 3) {
		const [_, domain, tld] = hostname.split('.');
		const url = `${protocol}//${slug}.${domain}.${tld}`;
		window.location.href = url;
	}
}
</script>

<template>
	<div
		ref="backdropRef"
		v-if="states.open"
		id="backdrop"
		class="absolute h-screen w-screen bg-black/30 backdrop-blur-sm top-0 left-0 z-10 animate__animated animate__veryfast"
		:class="{
			animate__fadeIn: !states.open,
		}"
	>
		<div
			ref="modalRef"
			id="modal"
			class="flex flex-col relative mx-auto max-w-lg bg-white top-1/4 rounded-md shadow-md animate__animated animate__veryfast"
			:class="{
				animate__zoomIn: states.open,
			}"
		>
			<!-- input -->
			<div class="p-5 border-b border-1 border-solid">
				<label class="input input-bordered flex items-center gap-2">
					<input
						ref="inputRef"
						type="text"
						class="grow"
						v-model="states.search"
						@keydown.enter="search"
						id="search"
						name="search"
						placeholder="Search for a coach or a systems..."
					/>
					<button
						@click="search"
						class="hover:bg-neutral hover:text-white h-8 w-8 flex justify-center items-center rounded-md"
					>
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
					</button>
				</label>
			</div>

			<div class="px-5 py-4 max-h-[335px] overflow-y-scroll bg-[#E8E9EA]">
				<!-- searched -->
				<ul v-if="computedSearchedData.length && states.search.length" class="flex flex-col gap-2">
					<li
						class="p-3 shadow-sm rounded-md hover:bg-neutral hover:text-white"
						v-for="(tenant, idx) in computedSearchedData"
						:key="tenant.id"
						:class="[states.selectedIndex === idx ? 'bg-neutral text-white selected' : 'bg-white']"
					>
						<a class="flex gap-2" :href="computedDomain(tenant.slug)">
							<div class="p-3 flex-0" :class="`bg-[${tenant.color}]`">{{ tenant.emoji }}</div>
							<div class="flex-1 h-full">
								<div class="flex flex-col gap-1">
									<p>{{ tenant.name }}</p>
									<div class="rating rating-xs">
										<input
											type="radio"
											name="rating-1"
											class="mask mask-star"
											:class="[states.selectedIndex === idx ? 'bg-white' : '']"
										/>
										<input
											type="radio"
											name="rating-1"
											class="mask mask-star"
											checked
											:class="[states.selectedIndex === idx ? 'bg-white' : '']"
										/>
										<input
											type="radio"
											name="rating-1"
											class="mask mask-star"
											:class="[states.selectedIndex === idx ? 'bg-white' : '']"
										/>
										<input
											type="radio"
											name="rating-1"
											class="mask mask-star"
											:class="[states.selectedIndex === idx ? 'bg-white' : '']"
										/>
										<input
											type="radio"
											name="rating-1"
											class="mask mask-star"
											:class="[states.selectedIndex === idx ? 'bg-white' : '']"
										/>
									</div>
								</div>
							</div>
							<span class="flex-0" v-if="states.selectedIndex === idx">↩</span>
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
						>No results for <span class="font-bold">{{ `"${states.search}"` }}</span></span
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
