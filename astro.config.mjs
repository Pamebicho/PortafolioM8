import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
	site: 'https://Pamebicho.github.io',
	base: 'PortafolioM8',
	integrations: [tailwind()],
});
