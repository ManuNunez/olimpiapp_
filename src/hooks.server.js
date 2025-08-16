import { redirect } from '@sveltejs/kit';

// Rutas que requieren autenticación
const protectedRoutes = ['/dashboard'];

// Rutas de autenticación que no deben ser accesibles si ya estás logueado
const authRoutes = ['/login', '/signup'];

export async function handle({ event, resolve }) {
	// Para rutas protegidas, verificar autenticación
	if (protectedRoutes.some(route => event.url.pathname.startsWith(route))) {
		// En el servidor no tenemos acceso a localStorage, 
		// por lo que necesitamos manejar esto en el cliente
		// o usar cookies para la autenticación
		
		// Por ahora, simplemente continuamos
		// La verificación real se hará en el cliente
	}
	
	const response = await resolve(event);
	return response;
}
