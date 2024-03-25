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
		outDir: './public/components',
		emptyOutDir: true,
		lib: {
			entry: resolve(__dirname, 'src/views/components'),
			name: Object.keys(getComponentEntries())[0],
			formats: ['umd'],
		},
		rollupOptions: {
			input: getComponentEntries(),
			external: ['vue'],
			output: {
				dir: './public/components',
				entryFileNames: 'js/[name].js',
				chunkFileNames: 'js/[name].js',
				assetFileNames: 'js/[name][extname]',
				globals: {
					vue: 'Vue',
				},
			},
		},
	},
});
