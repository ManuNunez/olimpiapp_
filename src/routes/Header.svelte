<script>
	import { page } from '$app/state';
	import { auth } from '$lib/api.js';
	import { onMount } from 'svelte';
	
	let isLoggedIn = false;
	
	onMount(() => {
		isLoggedIn = auth.isLoggedIn();
		
		// Escuchar cambios en el storage para actualizar el estado
		const handleStorageChange = () => {
			isLoggedIn = auth.isLoggedIn();
		};
		
		window.addEventListener('storage', handleStorageChange);
		
		return () => {
			window.removeEventListener('storage', handleStorageChange);
		};
	});
</script>

<header>
	<div class="logo">
		<a href="/">
			<span class="logo-icon">🏆</span>
			<span class="logo-text">OlimpiApp</span>
		</a>
	</div>

	<nav>
		<ul>
			<li aria-current={page.url.pathname === '/' ? 'page' : undefined}>
				<a href="/">Inicio</a>
			</li>
			{#if isLoggedIn}
				<!-- <li aria-current={page.url.pathname.startsWith('/dashboard') ? 'page' : undefined}>
					<a href="/competencias">competencias</a>
				</li>
								<li aria-current={page.url.pathname.startsWith('/dashboard') ? 'page' : undefined}>
					<a href="/dashboard">Dashboard</a>
				</li> -->
			{:else}
				<li aria-current={page.url.pathname === '/login' ? 'page' : undefined}>
					<a href="/login">Iniciar Sesión</a>
				</li>
				<li aria-current={page.url.pathname === '/signup' ? 'page' : undefined}>
					<a href="/signup">Registrarse</a>
				</li>
			{/if}
		</ul>
	</nav>

	<div class="user-actions">
		{#if isLoggedIn}
			<a href="/account" class="user-link">
				<span class="user-icon">👤</span>
				Perfil
			</a>
		{/if}
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 2rem;
		background: var(--color-surface);
		box-shadow: 0 2px 4px rgba(59, 57, 54, 0.15);
		border-bottom: 1px solid var(--color-border);
	}

	.logo {
		display: flex;
		align-items: center;
	}

	.logo a {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		text-decoration: none;
		color: var(--color-text);
		font-weight: 700;
		font-size: 1.5rem;
		transition: color 0.2s ease;
	}

	.logo a:hover {
		color: var(--color-primary);
	}

	.logo-icon {
		font-size: 1.8rem;
	}

	.logo-text {
		color: var(--color-primary);
	}

	nav {
		display: flex;
		justify-content: center;
		flex: 1;
	}

	ul {
		display: flex;
		list-style: none;
		padding: 0;
		margin: 0;
		gap: 2rem;
	}

	li {
		position: relative;
	}

	li[aria-current='page']::after {
		content: '';
		position: absolute;
		bottom: -0.5rem;
		left: 0;
		right: 0;
		height: 2px;
		background: var(--color-primary);
		border-radius: 1px;
	}

	nav a {
		display: flex;
		align-items: center;
		padding: 0.5rem 1rem;
		color: var(--color-text-secondary);
		font-weight: 500;
		font-size: 0.95rem;
		text-decoration: none;
		transition: all 0.2s ease;
		border-radius: 4px;
	}

	nav a:hover {
		color: var(--color-primary);
		background: rgba(178, 190, 191, 0.2);
	}

	.user-actions {
		display: flex;
		align-items: center;
	}

	.user-link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		color: var(--color-text-secondary);
		font-weight: 500;
		text-decoration: none;
		border-radius: 4px;
		transition: all 0.2s ease;
	}

	.user-link:hover {
		color: var(--color-primary);
		background: rgba(178, 190, 191, 0.2);
	}

	.user-icon {
		font-size: 1.2rem;
	}

	@media (max-width: 768px) {
		header {
			padding: 1rem;
		}
		
		ul {
			gap: 1rem;
		}
		
		nav a {
			padding: 0.5rem;
			font-size: 0.9rem;
		}
		
		.logo-text {
			display: none;
		}
	}
</style>
