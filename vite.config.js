import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const parseComponentArg = () => {
  const arg =
    process.env.COMPONENT_ARG ||
    "src/views/components/head-world.vue:MyComponent";
  const [path, name] = arg.split(":");
  return { path, name };
};

const { path: componentPath, name: componentName } = parseComponentArg();

export default defineConfig({
  plugins: [vue({
    isProduction: true,
  })],
  build: {
    outDir: './public',
    emptyOutDir: false,

    lib: {
      entry: componentPath,
      name: componentName,
      formats: ['umd']
    },
    rollupOptions: {
      external: ["vue", "lodash", "moment"],
      output: {
        dir: componentPath.replace(/\/[^\/]+$/, ""),
        entryFileNames: `${componentName}.js`,
        globals: {
          vue: "Vue"
        },
      },
    },
  }
});
