import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import react from '@vitejs/plugin-react';
import { terser } from 'rollup-plugin-terser';

export default defineConfig({
  plugins: [vue(), react()],
  build: {
    lib: {
      entry: {
        'index': './src/index.ts',
        'vue2/index': './src/vue2/index.ts',
        'vue2/child': './src/vue2/child.ts',
        'vue3/index': './src/vue3/index.ts',
        'vue3/child': './src/vue3/child.ts',
        'react/index': './src/react/index.tsx',
        'react/child': './src/react/child.tsx',
      },
      formats: ['es', 'umd'],
      fileName: (format, entryName) => `${entryName}.${format}.js`,
    },
    outDir: 'dist',
    rollupOptions: {
      external: ['vue', 'react'],
      output: {
        globals: {
          vue: 'Vue',
          react: 'React',
        },
      },
      plugins: [
        terser({
          compress: {
            drop_console: true,
          },
        }),
      ],
    },
  },
});