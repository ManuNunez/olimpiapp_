<script>
	import { auth } from '$lib/api.js';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	
	let { children } = $props();
	let user = null;
	
	onMount(() => {
		// Verificar autenticación al montar
		if (!auth.isLoggedIn()) {
			goto('/login');
		}
	});
	
	function handleLogout() {
		auth.logout();
		goto('/login');
	}
</script>

<div class="dashboard-layout">
	<header class="dashboard-header">
		<div class="header-content">
			<h1>OlimpiApp Dashboard</h1>
			<nav>
				<button class="logout-btn" on:click={handleLogout}>
					Cerrar Sesión
				</button>
			</nav>
		</div>
	</header>
	
	<main class="dashboard-main">
		{@render children()}
	</main>
</div>

<style>
	.dashboard-layout {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
	
	.dashboard-header {
		background: #007bff;
		color: white;
		padding: 1rem 0;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
	
	.header-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.dashboard-header h1 {
		margin: 0;
		font-size: 1.5rem;
	}
	
	.logout-btn {
		background: rgba(255, 255, 255, 0.2);
		color: white;
		border: 1px solid rgba(255, 255, 255, 0.3);
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.3s;
	}
	
	.logout-btn:hover {
		background: rgba(255, 255, 255, 0.3);
	}
	
	.dashboard-main {
		flex: 1;
		padding: 2rem;
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
	}
</style>
