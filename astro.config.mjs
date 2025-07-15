import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  	site: 'https://Pamebicho.github.io/PortafolioM8', // cambia según tu URL
  	outDir: './dist',
  	base: '/PortafolioM8/',
	integrations: [tailwind()],
});
