<script>
	import { onMount } from 'svelte';
	import { get } from '$lib/api.js';
	
	let user = null;
	let stats = {
		totalCompetitions: 0,
		activeCompetitions: 0,
		totalParticipants: 0,
		upcomingEvents: 0
	};
	let loading = true;
	
	onMount(async () => {
		try {
			// Obtener datos del usuario y estadísticas
			const userResponse = await get('/user/profile');
			user = userResponse.user;
			
			const statsResponse = await get('/dashboard/stats');
			stats = statsResponse.stats;
		} catch (error) {
			console.error('Error loading dashboard data:', error);
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>Dashboard - OlimpiApp</title>
</svelte:head>

<div class="dashboard-content">
	<div class="welcome-section">
		<h2>¡Bienvenido a OlimpiApp!</h2>
		{#if user}
			<p>Hola, {user.name}. Aquí tienes un resumen de las olimpiadas.</p>
		{:else}
			<p>Gestiona y participa en olimpiadas académicas.</p>
		{/if}
	</div>

	{#if loading}
		<div class="loading">
			<p>Cargando datos del dashboard...</p>
		</div>
	{:else}
		<div class="stats-grid">
			<div class="stat-card">
				<div class="stat-icon">🏆</div>
				<div class="stat-info">
					<h3>{stats.totalCompetitions}</h3>
					<p>Competencias Totales</p>
				</div>
			</div>
			
			<div class="stat-card">
				<div class="stat-icon">🎯</div>
				<div class="stat-info">
					<h3>{stats.activeCompetitions}</h3>
					<p>Competencias Activas</p>
				</div>
			</div>
			
			<div class="stat-card">
				<div class="stat-icon">👥</div>
				<div class="stat-info">
					<h3>{stats.totalParticipants}</h3>
					<p>Participantes</p>
				</div>
			</div>
			
			<div class="stat-card">
				<div class="stat-icon">📅</div>
				<div class="stat-info">
					<h3>{stats.upcomingEvents}</h3>
					<p>Próximos Eventos</p>
				</div>
			</div>
		</div>

		<div class="actions-section">
			<h3>Acciones Rápidas</h3>
			<div class="action-buttons">
				<a href="/dashboard/competitions" class="action-btn primary">
					Ver Competencias
				</a>
				<a href="/dashboard/participants" class="action-btn secondary">
					Gestionar Participantes
				</a>
				<a href="/dashboard/results" class="action-btn secondary">
					Ver Resultados
				</a>
				<a href="/dashboard/settings" class="action-btn secondary">
					Configuración
				</a>
			</div>
		</div>

		<div class="recent-section">
			<h3>Actividad Reciente</h3>
			<div class="activity-list">
				<div class="activity-item">
					<div class="activity-icon">🏆</div>
					<div class="activity-content">
						<p><strong>Nueva competencia creada:</strong> Olimpiada de Matemáticas 2024</p>
						<span class="activity-time">Hace 2 horas</span>
					</div>
				</div>
				<div class="activity-item">
					<div class="activity-icon">👤</div>
					<div class="activity-content">
						<p><strong>Nuevo participante registrado:</strong> María González</p>
						<span class="activity-time">Hace 4 horas</span>
					</div>
				</div>
				<div class="activity-item">
					<div class="activity-icon">📊</div>
					<div class="activity-content">
						<p><strong>Resultados publicados:</strong> Olimpiada de Física</p>
						<span class="activity-time">Hace 1 día</span>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.dashboard-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}
	
	.welcome-section {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 2rem;
		border-radius: 12px;
		margin-bottom: 2rem;
		text-align: center;
	}
	
	.welcome-section h2 {
		margin: 0 0 1rem 0;
		font-size: 2rem;
		font-weight: 600;
	}
	
	.welcome-section p {
		margin: 0;
		font-size: 1.1rem;
		opacity: 0.9;
	}
	
	.loading {
		text-align: center;
		padding: 3rem;
		color: #666;
	}
	
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}
	
	.stat-card {
		background: white;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		gap: 1rem;
		transition: transform 0.2s ease;
	}
	
	.stat-card:hover {
		transform: translateY(-2px);
	}
	
	.stat-icon {
		font-size: 2.5rem;
		background: #f8f9fa;
		padding: 1rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 60px;
		height: 60px;
	}
	
	.stat-info h3 {
		margin: 0;
		font-size: 2rem;
		font-weight: 700;
		color: #333;
	}
	
	.stat-info p {
		margin: 0.5rem 0 0 0;
		color: #666;
		font-size: 0.9rem;
	}
	
	.actions-section, .recent-section {
		background: white;
		border-radius: 12px;
		padding: 2rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		margin-bottom: 2rem;
	}
	
	.actions-section h3, .recent-section h3 {
		margin: 0 0 1.5rem 0;
		color: #333;
		font-size: 1.5rem;
	}
	
	.action-buttons {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}
	
	.action-btn {
		padding: 1rem 1.5rem;
		border-radius: 8px;
		text-decoration: none;
		font-weight: 500;
		text-align: center;
		transition: all 0.2s ease;
		display: block;
	}
	
	.action-btn.primary {
		background: #007bff;
		color: white;
	}
	
	.action-btn.primary:hover {
		background: #0056b3;
	}
	
	.action-btn.secondary {
		background: #f8f9fa;
		color: #333;
		border: 1px solid #dee2e6;
	}
	
	.action-btn.secondary:hover {
		background: #e9ecef;
	}
	
	.activity-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	
	.activity-item {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		padding: 1rem;
		background: #f8f9fa;
		border-radius: 8px;
		border-left: 4px solid #007bff;
	}
	
	.activity-icon {
		font-size: 1.5rem;
		flex-shrink: 0;
	}
	
	.activity-content {
		flex: 1;
	}
	
	.activity-content p {
		margin: 0 0 0.5rem 0;
		color: #333;
	}
	
	.activity-time {
		color: #666;
		font-size: 0.85rem;
	}
	
	@media (max-width: 768px) {
		.dashboard-content {
			padding: 1rem;
		}
		
		.stats-grid {
			grid-template-columns: 1fr;
		}
		
		.action-buttons {
			grid-template-columns: 1fr;
		}
		
		.welcome-section {
			padding: 1.5rem;
		}
		
		.welcome-section h2 {
			font-size: 1.5rem;
		}
	}
</style>
