import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx',
    include: /.*\.js$/,
    exclude: []
  },
  resolve: {
    alias: {
      'react-custom-scrollbars': path.resolve(__dirname, '../../src/index.ts'),
    },
  },
});
