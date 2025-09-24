<script>
	export let contest;

	let showRegistrationForm = false;

	function formatDate(dateString) {
		const date = new Date(dateString);
		return date.toLocaleDateString('es-MX', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getContestStatus(contest) {
		const now = new Date();
		const startTime = new Date(contest.date);
		const endTime = new Date(startTime.getTime() + (contest.duration * 60 * 1000));
		
		if (now < startTime) {
			return { status: 'upcoming', label: 'Próximo', class: 'status-upcoming' };
		} else if (now >= startTime && now <= endTime) {
			return { status: 'ongoing', label: 'En curso', class: 'status-ongoing' };
		} else {
			return { status: 'finished', label: 'Finalizado', class: 'status-finished' };
		}
	}

	function formatDuration(minutes) {
		const hours = Math.floor(minutes / 60);
		const remainingMinutes = minutes % 60;
		return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
	}

	$: contestStatus = getContestStatus(contest);

	function toggleRegistrationForm() {
		showRegistrationForm = !showRegistrationForm;
	}

	function submitRegistration(e) {
		e.preventDefault();
		// Aquí iría la lógica para enviar el formulario
		alert(`Te has inscrito en ${contest.name}`);
		showRegistrationForm = false;
	}
</script>

{#if contest.status !== 0}
<div class="contest-card">
	<div class="contest-header">
		<div class="contest-title-section">
			<h3 class="contest-title">{contest.name}</h3>
			<span class="contest-status {contestStatus.class}">
				{contestStatus.label}
			</span>
		</div>
		<div class="contest-meta">
			<span class="contest-date">{formatDate(contest.date)}</span>
			<span class="contest-duration">⏱️ {formatDuration(contest.duration)}</span>
		</div>
	</div>

	{#if contest.description}
		<div class="contest-description">
			<p>{contest.description}</p>
		</div>
	{/if}

	<div class="contest-details">
		<div class="detail-item">
			<span class="detail-label">Preguntas:</span>
			<span class="detail-value">{contest.number_of_questions}</span>
		</div>

		{#if contest.campuses && contest.campuses.length > 0}
			<div class="detail-item">
				<span class="detail-label">Campus:</span>
				<div class="tags">
					{#each contest.campuses as campus}
						<span class="tag campus-tag">{campus.name}</span>
					{/each}
				</div>
			</div>
		{/if}

		{#if contest.classrooms && contest.classrooms.length > 0}
			<div class="detail-item">
				<span class="detail-label">Aulas:</span>
				<div class="tags">
					{#each contest.classrooms as classroom}
						<span class="tag classroom-tag">{classroom.name}</span>
					{/each}
				</div>
			</div>
		{/if}

		{#if contest.participations}
			<div class="detail-item">
				<span class="detail-label">Participantes:</span>
				<span class="detail-value">{contest.participations.length}</span>
			</div>
		{/if}
	</div>

	<div class="contest-actions">
		<button class="btn btn-primary" on:click={() => window.location.href = `/admin/contests/${contest.id}`}>
			Ver Detalles
		</button>
		<button class="btn btn-secondary" on:click={() => window.location.href = `/admin/contests/${contest.id}/edit`}>
			Editar
		</button>
		{#if contestStatus.status === 'upcoming'}
			<button class="btn btn-danger" on:click={() => {
				if (confirm('¿Estás seguro de que deseas eliminar este contest?')) {
					console.log('Eliminar contest:', contest.id);
				}
			}}>
				Eliminar
			</button>
		{/if}
		<button class="btn btn-success" on:click={toggleRegistrationForm}>
			{showRegistrationForm ? 'Cerrar Inscripción' : 'Inscribirse'}
		</button>
	</div>

	{#if showRegistrationForm}
		<form class="registration-form" on:submit|preventDefault={submitRegistration}>
			<div class="form-group">
				<label>Nombre completo:</label>
				<input type="text" required />
			</div>
			<div class="form-group">
				<label>Correo electrónico:</label>
				<input type="email" required />
			</div>
			<button type="submit" class="btn btn-primary">Enviar inscripción</button>
		</form>
	{/if}
</div>
{/if}

<style>
	/* Estilos del formulario */
	.registration-form {
		margin-top: 1rem;
		padding: 1rem;
		background-color: #f9f9f9;
		border: 1px solid #ddd;
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}
	.registration-form .form-group {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.registration-form input {
		padding: 0.5rem;
		border-radius: 6px;
		border: 1px solid #ccc;
	}
	.btn-success {
		background-color: #388e3c;
		color: white;
	}
	.btn-success:hover {
		background-color: #2e7d32;
		transform: translateY(-1px);
	}
	.contest-card {
		background: var(--color-surface);
		border: 2px solid var(--color-border);
		border-radius: 12px;
		padding: 1.5rem;
		margin-bottom: 1rem;
		transition: all 0.3s ease;
		box-shadow: 0 4px 6px rgba(59, 57, 54, 0.1);
	}
	
	.contest-card:hover {
		border-color: var(--color-primary);
		transform: translateY(-2px);
		box-shadow: 0 8px 20px rgba(59, 57, 54, 0.15);
	}
	
	.contest-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1rem;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	
	.contest-title-section {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}
	
	.contest-title {
		color: var(--color-text);
		margin: 0;
		font-size: 1.5rem;
		font-weight: 600;
	}
	
	.contest-status {
		padding: 0.25rem 0.75rem;
		border-radius: 20px;
		font-size: 0.875rem;
		font-weight: 500;
		text-transform: uppercase;
	}
	
	.status-upcoming {
		background-color: #e3f2fd;
		color: #1565c0;
	}
	
	.status-ongoing {
		background-color: #e8f5e8;
		color: #2e7d32;
	}
	
	.status-finished {
		background-color: #fafafa;
		color: #616161;
	}
	
	.contest-meta {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.25rem;
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}
	
	.contest-date {
		font-weight: 500;
	}
	
	.contest-duration {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}
	
	.contest-description {
		margin-bottom: 1rem;
		padding: 1rem;
		background-color: var(--color-light-gray);
		border-radius: 8px;
	}
	
	.contest-description p {
		margin: 0;
		color: var(--color-text-secondary);
		line-height: 1.6;
	}
	
	.contest-details {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}
	
	.detail-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
	
	.detail-label {
		font-weight: 600;
		color: var(--color-text);
		min-width: 100px;
	}
	
	.detail-value {
		color: var(--color-text-secondary);
		font-weight: 500;
	}
	
	.tags {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
	
	.tag {
		padding: 0.25rem 0.75rem;
		border-radius: 16px;
		font-size: 0.75rem;
		font-weight: 500;
	}
	
	.campus-tag {
		background-color: #fff3e0;
		color: #ef6c00;
	}
	
	.classroom-tag {
		background-color: #f3e5f5;
		color: #7b1fa2;
	}
	
	.contest-actions {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}
	
	.btn {
		padding: 0.5rem 1rem;
		border-radius: 6px;
		border: none;
		cursor: pointer;
		font-weight: 500;
		transition: all 0.3s ease;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}
	
	.btn-primary {
		background-color: var(--color-primary);
		color: var(--color-surface);
	}
	
	.btn-primary:hover {
		background-color: var(--color-hover);
		transform: translateY(-1px);
	}
	
	.btn-secondary {
		background-color: transparent;
		color: var(--color-primary);
		border: 2px solid var(--color-primary);
	}
	
	.btn-secondary:hover {
		background-color: var(--color-primary);
		color: var(--color-surface);
	}
	
	.btn-danger {
		background-color: #d32f2f;
		color: white;
	}
	
	.btn-danger:hover {
		background-color: #b71c1c;
		transform: translateY(-1px);
	}
	
	/* Responsive */
	@media (max-width: 768px) {
		.contest-header {
			flex-direction: column;
			align-items: flex-start;
		}
		
		.contest-meta {
			align-items: flex-start;
		}
		
		.contest-title-section {
			width: 100%;
			justify-content: space-between;
		}
		
		.contest-actions {
			flex-direction: column;
		}
		
		.btn {
			width: 100%;
		}
		
		.detail-item {
			flex-direction: column;
			align-items: flex-start;
		}
		
		.detail-label {
			min-width: auto;
		}
	}
</style>