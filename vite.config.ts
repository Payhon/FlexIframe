import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import react from '@vitejs/plugin-react';
import terser from '@rollup/plugin-terser';

export default defineConfig({
  plugins: [vue(), react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'FlexIframe',
      formats: ['es', 'umd'],
      fileName: (format) => `flex-iframe.${format}.js`,
    },
    rollupOptions: {
      external: ['vue', 'react'],
      output: [
        {
          format: 'umd',
          name: 'FlexIframe',
          entryFileNames: 'flex-iframe.umd.js',
          globals: {
            vue: 'Vue',
            react: 'React',
          },
        },
        {
          format: 'umd',
          name: 'FlexIframe',
          entryFileNames: 'flex-iframe.umd.min.js',
          plugins: [terser({
            mangle: true,
            compress: true
          })],
          globals: {
            vue: 'Vue',
            react: 'React',
          },
        },
        {
          format: 'es',
          entryFileNames: 'flex-iframe.es.js',
        },
        {
          format: 'es',
          entryFileNames: 'flex-iframe.es.min.js',
          plugins: [terser({
            mangle: true,
            compress: true
          })],
        },
      ],
    },
    minify: false,
    sourcemap: true,
    target: 'es2015',
  },
  server: {
    open: true, // 自动打开浏览器
  },
  publicDir: 'test', // 将 test 目录作为静态资源目录
});