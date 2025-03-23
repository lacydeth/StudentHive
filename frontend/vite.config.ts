import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: '0.0.0.0', // Hozzáférhető a hálózaton
    port: 3000,      // Tetszőleges port (pl. 3000)
  },
});
