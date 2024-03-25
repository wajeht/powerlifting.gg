import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import fs from 'fs';

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

export default defineConfig({
	plugins: [vue()],
	build: {
		outDir: './public',
		emptyOutDir: false,
		rollupOptions: {
			input: getComponentEntries(),
			output: {
				entryFileNames: 'js/[name].js',
				chunkFileNames: 'js/[name].js',
				assetFileNames: 'js/[name][extname]',
			},
		},
	},
});
