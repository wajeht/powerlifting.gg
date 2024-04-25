import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import fs from 'fs';

function getComponentEntries(componentDir) {
	const entries = {};
	const files = fs.readdirSync(componentDir);
	files.forEach((file) => {
		const filePath = resolve(componentDir, file);
		const stat = fs.statSync(filePath);
		if (stat.isDirectory()) {
			const nestedEntries = getComponentEntries(filePath);
			Object.assign(entries, nestedEntries);
		} else if (file.endsWith('.vue')) {
			const componentName = filePath
				.replace(componentDir, '')
				.replace(/^\//, '')
				.replace(/\.vue$/, '');
			entries[componentName] = filePath;
		}
	});
	return entries;
}

export default defineConfig({
	plugins: [vue()],
	build: {
		minify: true,
		cssMinify: true,
		outDir: './public',
		emptyOutDir: false,
		lib: {
			entry: resolve(__dirname, 'src/web/views/components'),
			name: Object.keys(getComponentEntries(resolve(__dirname, 'src/web/views/components')))[0],
			formats: ['es'],
		},
		rollupOptions: {
			input: getComponentEntries(resolve(__dirname, 'src/web/views/components')),
			external: ['vue', 'axios'],
			output: {
				dir: './public',
				entryFileNames: 'js/[name].js',
				chunkFileNames: 'js/[name].js',
				assetFileNames: 'js/[name][extname]',
				globals: {
					vue: 'Vue',
					axios: 'axios',
				},
				inlineDynamicImports: false,
			},
		},
	},
});
