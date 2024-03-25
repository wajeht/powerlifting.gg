import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const parseComponentArg = () => {
	const arg = 'src/views/components/hello-world.vue:hello-world.vue';
	const [path, name] = arg.split(':');
	return { path, name };
};

const { path: componentPath, name: componentName } = parseComponentArg();

export default defineConfig({
	plugins: [
		vue({
			isProduction: true,
		}),
	],
	build: {
		emptyOutDir: false,
		outDir: '../../public',
		lib: {
			entry: componentPath,
			name: componentName,
			formats: ['umd'],
		},
		rollupOptions: {
			external: ['vue', 'lodash', 'moment'],
			output: {
				dir: './public',
				entryFileNames: `${componentName}.js`,
				globals: {
					vue: 'Vue',
				},
			},
		},
	},
});
