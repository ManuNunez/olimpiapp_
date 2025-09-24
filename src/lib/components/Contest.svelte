<script>
  export let contest;

  let showModal = false;
  let selectedCampus = '';
  let selectedGrade = '';
  let studentId = null;
$: console.log('Contest actualizado:', contest);

  const grades = [
    { value: '1', label: '1° a 5° de Primaria' },
    { value: '2', label: '6° de Primaria' },
    { value: '3', label: '1° de Secundaria' },
    { value: '4', label: '2° de Secundaria' },
    { value: '5', label: '3° de Secundaria' },
    { value: '6', label: 'Preparatoria' }
  ];

  function openRegistrationModal() {
    const profile = checkUserProfile();
    if (!profile) {
      alert('Debes completar tu perfil y estar autenticado para inscribirte');
      return;
    }
    studentId = profile.id;
    showModal = true;
    selectedCampus = '';
    selectedGrade = '';
  }

  function closeModal() {
    showModal = false;
  }

  async function submitRegistration(e) {
    e.preventDefault();
    if (!selectedCampus || !selectedGrade) {
      alert('Por favor selecciona campus y nivel');
      return;
    }

    try {
      const registrationData = {
        contest_id: contest.id,
        student_id: studentId,
        campus_id: selectedCampus,
        grade: selectedGrade
      };

      const API_BASE_URL = 'http://127.0.0.1:8000';
      const response = await fetch(`${API_BASE_URL}/api/participations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registrationData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      const result = await response.json();
      alert(`¡Inscripción exitosa en ${contest.name}!`);
      closeModal();

      window.dispatchEvent(new CustomEvent('contestRegistration', { 
        detail: { contestId: contest.id, result } 
      }));

    } catch (error) {
      console.error('Error en inscripción:', error);
      alert(`Error al inscribirse: ${error.message}`);
    }
  }

  function checkUserProfile() {
    try {
      const profile = localStorage.getItem('user_profile');
      const token = localStorage.getItem('auth_token');
      return profile && token ? JSON.parse(profile) : null;
    } catch (err) {
      console.error('Error parsing user_profile:', err);
      return null;
    }
  }

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

  function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
  }
</script>


<div class="contest-card">
  <div class="contest-header">
    <div class="contest-title-section">
      <h3 class="contest-title">{contest.name}</h3>
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

  <div class="contest-actions mt-4">
    <button 
      on:click={openRegistrationModal} 
      class="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition-all"
    >
      📝 Inscribirse
    </button>
  </div>
</div>


<!-- Modal -->
{#if showModal}
<div class="modal-overlay">
  <div class="modal-content">
    <div class="modal-header">
      <h3>Inscripción a {contest.name}</h3>
      <button class="close-btn" on:click={closeModal}>&times;</button>
    </div>
    <form class="registration-form" on:submit|preventDefault={submitRegistration}>
      <div class="form-group">
        <label>Campus</label>
        <select bind:value={selectedCampus}>
          <option value="">-- Selecciona un campus --</option>
          {#each contest.campuses || [] as campus}
            <option value={campus.id}>{campus.name}</option>
          {/each}
        </select>
      </div>

      <div class="form-group">
        <label>Nivel</label>
        <select bind:value={selectedGrade}>
          <option value="">-- Selecciona un nivel --</option>
          {#each grades as grade}
            <option value={grade.value}>{grade.label}</option>
          {/each}
        </select>
      </div>

      <div class="modal-actions">
        <button type="button" class="btn btn-secondary" on:click={closeModal}>Cancelar</button>
        <button type="submit" class="btn btn-primary">Confirmar</button>
      </div>
    </form>
  </div>
</div>
{/if}

<style>
	/* Modal styles */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		padding: 1rem;
	}
	
	.modal-content {
		background: white;
		border-radius: 12px;
		width: 100%;
		max-width: 500px;
		max-height: 90vh;
		overflow-y: auto;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
	}
	
	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		border-bottom: 1px solid #eee;
	}
	
	.modal-header h3 {
		margin: 0;
		color: #333;
		font-size: 1.25rem;
	}
	
	.close-btn {
		background: none;
		border: none;
		font-size: 2rem;
		cursor: pointer;
		color: #666;
		padding: 0;
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		transition: all 0.3s ease;
	}
	
	.close-btn:hover {
		background-color: #f0f0f0;
		color: #333;
	}
	
	.registration-form {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	
	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	
	.form-group label {
		font-weight: 600;
		color: #333;
		font-size: 0.9rem;
	}
	
	.form-group input,
	.form-group select {
		padding: 0.75rem;
		border-radius: 8px;
		border: 2px solid #e1e5e9;
		font-size: 1rem;
		transition: border-color 0.3s ease;
	}
	
	.form-group input:focus,
	.form-group select:focus {
		outline: none;
		border-color: #4CAF50;
		box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
	}
	
	.modal-actions {
		display: flex;
		gap: 1rem;
		margin-top: 1rem;
		justify-content: flex-end;
	}
	
	/* Status styles actualizados */
	.status-available {
		background-color: #e8f5e8;
		color: #2e7d32;
	}
	
	.status-closed {
		background-color: #ffebee;
		color: #c62828;
	}
	
	.status-hidden {
		background-color: #f5f5f5;
		color: #757575;
	}
	
	/* Estilos existentes */
	.btn-success {
		background-color: #4CAF50;
		color: white;
		border: none;
	}
	
	.btn-success:hover {
		background-color: #45a049;
		transform: translateY(-1px);
	}
	
	.contest-card {
		background: var(--color-surface, white);
		border: 2px solid var(--color-border, #e1e5e9);
		border-radius: 12px;
		padding: 1.5rem;
		margin-bottom: 1rem;
		transition: all 0.3s ease;
		box-shadow: 0 4px 6px rgba(59, 57, 54, 0.1);
	}
	
	.contest-card:hover {
		border-color: var(--color-primary, #4CAF50);
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
		color: var(--color-text, #333);
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
		color: var(--color-text-secondary, #666);
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
		background-color: var(--color-light-gray, #f8f9fa);
		border-radius: 8px;
	}
	
	.contest-description p {
		margin: 0;
		color: var(--color-text-secondary, #666);
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
		color: var(--color-text, #333);
		min-width: 100px;
	}
	
	.detail-value {
		color: var(--color-text-secondary, #666);
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
		background-color: var(--color-primary, #4CAF50);
		color: var(--color-surface, white);
	}
	
	.btn-primary:hover {
		background-color: var(--color-hover, #45a049);
		transform: translateY(-1px);
	}
	
	.btn-secondary {
		background-color: transparent;
		color: var(--color-primary, #4CAF50);
		border: 2px solid var(--color-primary, #4CAF50);
	}
	
	.btn-secondary:hover {
		background-color: var(--color-primary, #4CAF50);
		color: var(--color-surface, white);
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
		.modal-content {
			margin: 0;
			border-radius: 0;
			height: 100vh;
			max-height: 100vh;
		}
		
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
		
		.modal-actions {
			flex-direction: column;
		}
	}
</style>