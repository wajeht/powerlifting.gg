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

			<div class="flex flex-col mt-2 gap-1">
				<div class="w-fit">
					<label class="label gap-2 justify-start" for="checkbox"
						><input type="checkbox" class="checkbox" id="checkbox" name="checkbox" required="" />
						<span class="label-text text-base">I agree</span></label
					>
				</div>
				<div class="pl-1">
					Signing up signifies that you have read and agree to the
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
						💪
					</div>
				</div>

				<!-- rating -->
				<div class="rating rating-xs mt-3">
					<input v-for="i in 5" type="radio" class="mask mask-star-2 bg-orange-400" disabled />
				</div>

				<!-- name -->
				<div class="flex items-center mt-1">
					<h4 class="m-0 p-0 text-white drop-shadow-sm text-3xl font-extrabold -mb-1">
						<span v-if="states.name">
							{{ states.name }}
						</span>
						<span v-else>Your Name</span>
					</h4>
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
