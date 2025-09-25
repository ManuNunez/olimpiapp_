<script>
	// Página principal de listado de contests disponibles para inscripción
	import { onMount } from 'svelte';
	import Contest from '$lib/components/Contest.svelte';
	
	let contests = [];
	let loading = true;
	let error = null;
	let currentPage = 1;
	let totalPages = 1;
	let perPage = 10;
	let userProfile = null;
	
	// Verificar si existe user_profile en localStorage
	function checkUserProfile() {
		try {
			const profile = localStorage.getItem('user_profile');
			userProfile = profile ? JSON.parse(profile) : null;
		} catch (err) {
			console.error('Error parsing user_profile:', err);
			userProfile = null;
		}
	}
	
	async function loadContests() {
		loading = true;
		error = null;

		try {
			const params = new URLSearchParams({
				status: '1',
			});

			const API_BASE_URL = mport.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
			const response = await fetch(`${API_BASE_URL}/api/contests?${params}`, {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

			const data = await response.json();
			
			// Filtrar contests con status 1
			contests = (data.contests || []).filter(contest => {
				return contest.status === 1 || contest.status === '1';
			});
			
			console.log('Contests cargados:', contests.length);

		} catch (err) {
			console.error('ERROR EN loadContests:', err);
			error = err.message;
		} finally {
			loading = false;
		}
	}
	
	// Función para cambiar de página
	function changePage(page) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
			loadContests();
		}
	}
	
	// Escuchar eventos de inscripción para actualizar la lista
	function handleContestRegistration(event) {
		console.log('Contest registration successful:', event.detail);
		// Recargar contests para actualizar cualquier cambio
		loadContests();
	}
	
	// Cargar datos al montar el componente
	onMount(() => {
		checkUserProfile();
		loadContests();
		
		// Escuchar eventos de inscripción
		window.addEventListener('contestRegistration', handleContestRegistration);
		
		// Limpiar event listener al destruir el componente
		return () => {
			window.removeEventListener('contestRegistration', handleContestRegistration);
		};
	});
</script>

<svelte:head>
	<title>Contests Disponibles - OlimpiApp</title>
	<meta name="description" content="Contests y olimpiadas académicas disponibles para inscripción" />
</svelte:head>

<!-- Header Section -->
<section class="contests-header">
	<div class="header-content">
		<h1>Contests Disponibles</h1>
		<p>Descubre y participa en las olimpiadas académicas abiertas</p>
	</div>
</section>

<!-- Content Section -->
<section class="contests-content">
	{#if loading}
		<div class="loading-state">
			<div class="loading-spinner"></div>
			<p>Cargando contests disponibles...</p>
		</div>
	{:else if error}
		<div class="error-state">
			<h3>Error al cargar contests</h3>
			<p>{error}</p>
			<button class="btn btn-primary" on:click={() => loadContests()}>
				Reintentar
			</button>
		</div>
	{:else if contests.length === 0}
		<div class="empty-state">
			<h3>No hay contests disponibles</h3>
			<p>Actualmente no hay contests abiertos para inscripción.</p>
			<button class="btn btn-secondary" on:click={loadContests}>
				Actualizar
			</button>
		</div>
	{:else}
		<div class="contests-grid">
			{#each contests as contest (contest.id)}
				<Contest {contest} />
			{/each}
		</div>
		
		<!-- Pagination -->
		{#if totalPages > 1}
			<div class="pagination">
				<button
					class="btn btn-secondary"
					disabled={currentPage === 1}
					on:click={() => changePage(currentPage - 1)}
				>
					← Anterior
				</button>
				
				<div class="page-numbers">
					{#each Array.from({length: Math.min(5, totalPages)}, (_, i) => {
						const startPage = Math.max(1, currentPage - 2);
						return Math.min(startPage + i, totalPages);
					}) as page}
						<button
							class="btn page-btn {currentPage === page ? 'active' : ''}"
							on:click={() => changePage(page)}
						>
							{page}
						</button>
					{/each}
				</div>
				
				<button
					class="btn btn-secondary"
					disabled={currentPage === totalPages}
					on:click={() => changePage(currentPage + 1)}
				>
					Siguiente →
				</button>
			</div>
		{/if}
	{/if}
</section>

<style>
	/* Header Section */
	.contests-header {
		text-align: center;
		padding: 3rem 2rem;
		background: linear-gradient(135deg, #f8f9fa, #e9ecef);
		border-bottom: 2px solid #dee2e6;
	}
	
	.header-content h1 {
		font-size: 2.5rem;
		color: #495057;
		margin-bottom: 1rem;
		font-weight: 700;
	}
	
	.header-content p {
		font-size: 1.25rem;
		color: #6c757d;
		margin-bottom: 2rem;
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
		line-height: 1.6;
	}
	
	/* Content Section */
	.contests-content {
		padding: 2rem;
		max-width: 1200px;
		margin: 0 auto;
	}
	
	/* Contest Cards Grid */
	.contests-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}
	
	/* Loading State */
	.loading-state {
		text-align: center;
		padding: 4rem 2rem;
	}
	
	.loading-spinner {
		width: 40px;
		height: 40px;
		border: 4px solid #dee2e6;
		border-top: 4px solid #007bff;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin: 0 auto 1rem auto;
	}
	
	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
	
	/* Error State */
	.error-state {
		text-align: center;
		padding: 4rem 2rem;
		color: #6c757d;
	}
	
	.error-state h3 {
		color: #dc3545;
		margin-bottom: 1rem;
	}
	
	/* Empty State */
	.empty-state {
		text-align: center;
		padding: 4rem 2rem;
		color: #6c757d;
	}
	
	.empty-state h3 {
		color: #495057;
		margin-bottom: 1rem;
	}
	
	/* Pagination */
	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		margin-top: 2rem;
	}
	
	.page-numbers {
		display: flex;
		gap: 0.25rem;
	}
	
	.page-btn {
		min-width: 40px;
		padding: 0.5rem;
	}
	
	.page-btn.active {
		background-color: #007bff;
		color: white;
	}
	
	/* Buttons */
	.btn {
		background-color: #007bff;
		color: white;
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		text-decoration: none;
		transition: all 0.3s ease;
		border: 2px solid #007bff;
		font-weight: 600;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}
	
	.btn:hover:not(:disabled) {
		background-color: #0056b3;
		border-color: #0056b3;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
	}
	
	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
	}
	
	.btn-secondary {
		background-color: transparent;
		color: #007bff;
		border: 2px solid #007bff;
	}
	
	.btn-secondary:hover:not(:disabled) {
		background-color: #007bff;
		color: white;
	}
	
	.btn-primary {
		background-color: #007bff;
		border-color: #007bff;
	}
	
	/* Responsive */
	@media (max-width: 768px) {
		.contests-header {
			padding: 2rem 1rem;
		}
		
		.header-content h1 {
			font-size: 2rem;
		}
		
		.header-content p {
			font-size: 1rem;
		}
		
		.contests-content {
			padding: 1rem;
		}
		
		.contests-grid {
			grid-template-columns: 1fr;
		}
		
		.pagination {
			flex-wrap: wrap;
		}
	}
</style>