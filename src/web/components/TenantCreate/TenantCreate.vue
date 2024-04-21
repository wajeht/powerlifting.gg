<script setup>
import { reactive, computed } from 'vue';

const props = defineProps({
	csrfToken: String,
});

const states = reactive({
	name: '',
	slug: '',
	banner: null,
	logo: null,
});

const computedSlug = computed(() => {
	if (states.name.length === 0) {
		return `https://slug-here.powerlifting.gg/`;
	}
	return `https://${states.name.split(' ').join('-')}.powerlifting.gg/`;
});

const handleBannerChange = (event) => {
	const file = event.target.files[0];
	if (file) {
		states.banner = URL.createObjectURL(file);
	}
};

const handleLogoChange = (event) => {
	const file = event.target.files[0];
	if (file) {
		states.logo = URL.createObjectURL(file);
	}
};
</script>

<template>
	<div class="grid grid-cols-3 gap-10">
		<!-- left -->
		<form
			id="tenants-create"
			action="/tenants"
			method="post"
			class="flex flex-col gap-3 col-span-2"
		>
			<!-- csrf -->
			<input type="hidden" id="csrfToken" name="csrfToken" :value="props.csrfToken" />

			<!-- name -->
			<label class="form-control w-full" for="email">
				<div class="label"><span class="label-text">Name</span></div>
				<input
					v-model="states.name"
					type="text"
					name="name"
					id="name"
					placeholder="Name"
					class="input input-bordered"
					required
				/>
			</label>

			<!-- slug -->
			<label class="form-control w-full" for="email">
				<div class="label"><span class="label-text">Slug</span></div>
				<input
					:value="computedSlug"
					type="text"
					name="slug"
					id="slug"
					placeholder="Slug"
					class="input input-bordered"
					readonly
				/>
			</label>

			<!-- logo -->
			<label class="form-control w-full" for="logo">
				<div class="label"><span class="label-text">Logo</span></div>
				<input
					@change="handleLogoChange"
					type="file"
					name="logo"
					id="logo"
					class="file-input file-input-bordered"
					accept="image/*"
				/>
			</label>

			<!-- banner -->
			<label class="form-control w-full" for="banner">
				<div class="label"><span class="label-text">Banner</span></div>
				<input
					@change="handleBannerChange"
					type="file"
					name="banner"
					id="banner"
					class="file-input file-input-bordered"
					accept="image/*"
				/>
			</label>

			<div class="flex flex-col mt-2 gap-1">
				<div class="w-fit">
					<label class="label gap-2 justify-start" for="checkbox"
						><input type="checkbox" class="checkbox" id="checkbox" name="checkbox" required="" />
						<span class="label-text text-base">I agree</span></label
					>
				</div>
				<div class="pl-1">
					Agreeing up signifies that you have read and agree to the
					<a href="/terms-of-services" class="link link-neutral" target="_blank"
						>Terms of Service</a
					>
					and our
					<a href="/privacy-policy" class="link link-neutral" target="_blank">Privacy Policy</a>.
				</div>
			</div>

			<!-- submit -->
			<div><input type="submit" value="Submit" class="btn btn-neutral text-white mt-4" /></div>
		</form>

		<!-- right -->
		<div
			class="shadow-sm rounded-md border border-1 bg-cover bg-center bg-no-repeat h-full"
			:style="{ backgroundImage: `url('${states.banner}')` }"
		>
			<!-- blur -->
			<div
				class="flex flex-col gap-3 items-center justify-center p-5 backdrop-blur-sm rounded-md h-full"
				:class="{
					'bg-neutral': !states.banner,
					'bg-black/70': states.banner,
				}"
			>
				<!-- img -->
				<div
					class="max-h-[100px] max-w-[100px] h-[100px] w-[100px] rounded-full flex justify-center items-center shadow-white shadow-sm bg-white"
				>
					<div
						class="bg-cover bg-center bg-no-repeat max-h-[100px] max-w-[100px] h-[100px] w-[100px] rounded-full"
						v-if="states.logo"
						:style="{ backgroundImage: `url('${states.logo}')` }"
					></div>
					<div v-else class="bg-white h-full w-full rounded-full flex justify-center items-center">
						<svg xmlns="http://www.w3.org/2000/svg" width="65" height="65" viewBox="0 0 72 72">
							<defs>
								<path
									id="openmojiFlexedBicepsDarkSkinTone0"
									d="M26.508 26.81c-.41-.02-.74-.06-.94-.09l.64-.49c.11.14.21.33.3.58"
								/>
							</defs>
							<g fill="#2C3440" stroke="#2C3440">
								<path
									d="M63.11 54.165c-10.969 9.44-26.36 11.68-46.41 11.563c0 0-3.74 1.15-4.597-3.565c0 0-.77-20.887 3.809-35.548c0 0-.195-5.981.029-9.897a2.574 2.574 0 0 1 .828-1.754c5.757-5.319 8.349-6.098 8.349-6.098l8.368-1.481c1.325.906 4.228 4.18 3.75 9.995l.107-.4l3.215.902c1.123.341 1.859 1.525 1.841 2.654c-.01 1.17-2.805 2.046-2.805 2.046l-6.118 1.383c-1.831 2.874-5.594 3.176-7.279 3.098c-.088-.243-.593-.02-.193 0c.594 1.5 1.289 5.115 1.922 11.807l.176 1.86c.048.527.316 4.73.384 7.477c1.812-4.413 6.636-12.561 15.735-13.847c13.463-1.92 20.165 8.495 20.165 8.495s.234.272.526.77c2.066 3.448 1.247 7.91-1.802 10.54z"
								/>
								<use href="#openmojiFlexedBicepsDarkSkinTone0" />
								<use href="#openmojiFlexedBicepsDarkSkinTone0" />
							</g>
							<g fill="#2E384E">
								<path
									d="M21.922 26.23s5.344-4.986 1.615-6.38l12.76-.419l.672-1.142l.22-1.844c1.07.178 3.364.946 3.64 1.012c0 0 2.405 1.873.45 4.093l-7.78 2.235s-4.723 3.803-11.577 2.445"
								/>
								<path
									d="M21.922 26.23c.794 9.218 2.56 25.641 2.07 27.745c-.045.7.655.81 1.012.296c.829-.667 2.767-2.597 3.818-5.195c0-5.762-.666-12.458-2.219-22.262c-.57-1.585-2.939-1.565-4.681-.584m26.277 7.87s10.239 6.972 3.106 16.42c0 0 2.132 8.516.155 9.85c-1.977 1.334 20.619-5.545 12.136-18.563c0 0-5.158-7.573-15.397-7.708"
								/>
							</g>
							<g
								fill="none"
								stroke="#506076"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-miterlimit="10"
								stroke-width="2"
							>
								<path
									d="M27.468 40.552c-.428-4.28-1.132-12.72-1.954-13.754c0 0 5.2 1.11 7.811-2.974m1.178 29.264s10.802 2.701 19.287-4.327"
								/>
								<path
									d="M27.72 50.631s2.868-14.473 16.368-16.393S64.3 42.753 64.3 42.753s.23.275.527.77c2.073 3.456 1.25 7.934-1.803 10.564c-10.992 9.464-26.426 11.712-46.518 11.597c0 0-3.75 1.145-4.61-3.574c0 0-.769-20.94 3.818-35.626c0 0-.197-6.002.03-9.93c.04-.67.334-1.296.827-1.751c5.78-5.332 8.375-6.115 8.375-6.115l8.388-1.484c1.436.984 4.725 4.739 3.57 11.495"
								/>
								<path
									d="M25.589 19.295s1.816 2.59 3.632-.284V16l-.46-1.658l-.36-.278m1.143 5.231s1.816 2.59 3.633-.284V16l-.873-2.125m4.516 5.136c-1.961 1.89-3.32 0-3.32 0m-13.199-2.564a3.732 3.732 0 0 1 1.278 2.432c.033.288.131.57.336.774c.595.594 1.959 1.517 3.323-.642V16l-.636-1.268m15.754 3.557c1.926.57 2.262 3.427-.702 4.1l-6.329 1.435"
								/>
							</g>
						</svg>
					</div>
				</div>

				<!-- rating -->
				<div class="rating rating-xs mt-3">
					<input v-for="i in 5" type="radio" class="mask mask-star-2 bg-orange-400" disabled />
				</div>

				<!-- name -->
				<div class="flex items-center mt-1 -mb-1 justify-center">
					<h4 class="m-0 p-0 text-white drop-shadow-sm text-3xl font-extrabold">
						<span v-if="states.name">
							{{ states.name }}
						</span>
						<span v-else>Your Name</span>
					</h4>
					<img class="w-8 h-8 p-0 m-0 -mb-[3px]" src="/img/verified.png" alt="verified" />
				</div>

				<!-- link -->
				<div v-if="states.name" class="link text-white no-underline hover:underline">
					{{ computedSlug }}
				</div>
				<div v-else class="link text-white no-underline hover:underline">
					https://your-name.powerlifting.gg/
				</div>
			</div>
		</div>
	</div>
</template>
