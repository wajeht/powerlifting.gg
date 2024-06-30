import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
	plugins: [vue()],
	test: {
		globals: true,
		watch: true,
		setupFiles: './src/tests/test-setup.js',
		environment: 'jsdom',
		exclude: ['node_modules', './src/tests/ete'],
	},
});
