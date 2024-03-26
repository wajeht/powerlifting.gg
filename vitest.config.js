import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
	plugins: [vue()],
	test: {
		globals: true,
		watch: true,
		setupFiles: './src/utils/test-setup.js',
		environment: 'jsdom',
	},
});
