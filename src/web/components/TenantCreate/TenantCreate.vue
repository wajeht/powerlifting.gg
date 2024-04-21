<script setup>
import { reactive } from 'vue';

const props = defineProps({
	csrfToken: String,
});

const states = reactive({
	name: 'coach',
	slug: '',
});
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
					v-model="states.slug"
					type="text"
					name="slug"
					id="slug"
					placeholder="Slug"
					class="input input-bordered"
					required
				/>
			</label>

			<!-- banner -->
			<label class="form-control w-full" for="banner">
				<div class="label"><span class="label-text">Banner</span></div>
				<input
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
					type="file"
					name="logo"
					id="logo"
					class="file-input file-input-bordered"
					accept="image/*"
				/>
			</label>

			<!-- submit -->
			<div><input type="submit" value="Submit" class="btn btn-neutral text-white mt-4" /></div>
		</form>

		<!-- right -->
		<div class="shadow-sm rounded-md border border-1 bg-cover bg-center bg-no-repeat h-fit">
			<!-- blur -->
			<div
				class="flex flex-col gap-3 items-center justify-between p-5 backdrop-blur-sm bg-neutral/70 rounded-md"
			>
				<!-- img -->
				<div
					class="h-[100px] w-[100px] rounded-full flex justify-center items-center shadow-white shadow-sm"
				>
					<img class="rounded-full" src="" alt="logo" />
				</div>

				<!-- rating -->
				<div class="rating rating-xs mt-2">
					<input v-for="i in 5" type="radio" class="mask mask-star-2 bg-orange-200" disabled />
				</div>

				<!-- name -->
				<div class="flex items-center mt-3">
					<h4 class="m-0 p-0 text-white drop-shadow-sm">
						{{ states.name }}
					</h4>
				</div>
			</div>
		</div>
	</div>
</template>
