import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import fs from 'fs';

export default defineConfig({
	plugins: [vue()],
	build: {
		outDir: './dist',
		emptyOutDir: false,
		rollupOptions: {
			input: getComponentEntries(), // Dynamically get all Vue component entries
			output: {
				entryFileNames: 'js/[name].js',
				chunkFileNames: 'js/[name].js',
				assetFileNames: 'js/[name][extname]',
			},
		},
	},
});

function getComponentEntries() {
	const componentDir = resolve(__dirname, 'src/views/components');
	const components = fs.readdirSync(componentDir).filter((file) => file.endsWith('.vue'));
	const entries = {};
	components.forEach((component) => {
		const componentName = component.replace(/\.vue$/, '');
		entries[componentName] = resolve(componentDir, component);
	});
	return entries;
}
