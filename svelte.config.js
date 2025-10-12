import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			out: 'build' // carpeta donde se guardará el servidor listo para producción
		})
	}
};

export default config;
