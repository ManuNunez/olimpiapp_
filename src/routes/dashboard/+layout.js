import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';

export const ssr = false; // Deshabilitar SSR para poder usar localStorage

export async function load({ url }) {
	if (browser) {
		// Verificar si el usuario está autenticado
		const token = localStorage.getItem('auth_token');
		
		if (!token) {
			// Redirigir al login con la URL actual como parámetro
			const returnUrl = url.pathname + url.search;
			throw redirect(302, `/login?returnUrl=${encodeURIComponent(returnUrl)}`);
		}
	}
	
	return {};
}
