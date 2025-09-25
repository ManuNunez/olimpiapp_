<script>
  export let contest;

  let showModal = false;
  let selectedCampus = '';
  let selectedGrade = '';
  let studentId = null;
  let isEnrolled = false;
  let checkingEnrollment = false;

  const grades = [
    { value: '1', label: '1° a 5° de Primaria' },
    { value: '2', label: '6° de Primaria' },
    { value: '3', label: '1° de Secundaria' },
    { value: '4', label: '2° de Secundaria' },
    { value: '5', label: '3° de Secundaria' },
    { value: '6', label: 'Preparatoria' }
  ];

  function getContestStatus(contest) {
    if (!contest || typeof contest.status === 'undefined') {
      console.warn('Contest is undefined or missing status:', contest);
      return { status: 'unknown', label: 'Cargando...', class: 'status-unknown' };
    }
    
    if (contest.status === 0 || contest.status === '0') {
      return { status: 'hidden', label: 'Oculto', class: 'status-hidden' };
    } else if (contest.status === 1 || contest.status === '1') {
      return { status: 'available', label: 'Disponible', class: 'status-available' };
    } else if (contest.status === 2 || contest.status === '2') {
      return { status: 'closed', label: 'Inscripciones Cerradas', class: 'status-closed' };
    }
    
    return { status: 'unknown', label: 'Estado desconocido', class: 'status-unknown' };
  }

  $: contestStatus = getContestStatus(contest);
  $: canRegister = contest && (contest.status === 1 || contest.status === '1') && !isEnrolled;

  // Verificar inscripción cuando cambie el contest
  $: if (contest && contest.id) {
    checkEnrollment();
  }

  // Función para verificar si el estudiante ya está inscrito
  async function checkEnrollment() {
    const profile = checkUserProfile();
    if (!profile || !contest || !contest.id) {
      isEnrolled = false;
      return;
    }

    checkingEnrollment = true;
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${API_BASE_URL}/api/participations/check/${contest.id}/student/${profile.studentId || profile.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        isEnrolled = data.is_enrolled || false;
      } else {
        console.warn('Error checking enrollment:', response.status);
        isEnrolled = false;
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
      isEnrolled = false;
    } finally {
      checkingEnrollment = false;
    }
  }

  // ✅ FUNCIÓN CORREGIDA
  function openRegistrationModal() {
    const profile = checkUserProfile();
    if (!profile) {
      alert('Debes completar tu perfil y estar autenticado para inscribirte');
      return; // ✅ Detener aquí si no hay perfil
    }
    
    if (!canRegister) {
      alert('Las inscripciones para este concurso no están disponibles');
      return; // ✅ Detener aquí si no puede registrarse
    }
    
    // ✅ Solo continuar si todas las validaciones pasan
    studentId = profile.studentId || profile.id;
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
        level: selectedGrade  // ✅ Cambiado de 'grade' a 'level'
      };

      console.log('Enviando datos de inscripción:', registrationData);

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
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

      // Actualizar el estado de inscripción
      isEnrolled = true;

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('contestRegistration', { 
          detail: { contestId: contest.id, result } 
        }));
      }

    } catch (error) {
      console.error('Error en inscripción:', error);
      alert(`Error al inscribirse: ${error.message}`);
    }
  }

  function checkUserProfile() {
    try {
      const currentUser = localStorage.getItem('current_user');
      const token = localStorage.getItem('auth_token');
      const studentProfile = localStorage.getItem('student_profile');
      
      if (currentUser && token) {
        const parsedUser = JSON.parse(currentUser);
        const parsedStudentProfile = studentProfile ? JSON.parse(studentProfile) : null;
        
        if (parsedStudentProfile && parsedStudentProfile.hasStudentProfile) {
          return {
            id: parsedUser.id,
            name: parsedUser.name,
            email: parsedUser.email,
            studentId: parsedStudentProfile.schoolInfo?.studentId,
            hasStudentProfile: parsedStudentProfile.hasStudentProfile
          };
        }
      }
      return null;
    } catch (err) {
      console.error('Error parsing user data:', err);
      return null;
    }
  }

  function formatDate(dateString) {
    if (!dateString) return 'Fecha no disponible';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Fecha inválida';
    }
  }

  function formatDuration(minutes) {
    if (!minutes || isNaN(minutes)) return 'Duración no disponible';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
  }
</script>

{#if contest && contest.id && contest.status !== 0}
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
        <span class="detail-label">Sedes disponibles:</span>
        <div class="tags">
          {#each contest.campuses as campus}
            <span class="tag campus-tag">{campus.name}</span>
          {/each}
        </div>
      </div>
    {/if}
  </div>

  <div class="contest-actions">
    {#if checkingEnrollment}
      <button 
        class="btn btn-disabled" 
        disabled
      >
        🔄 Verificando...
      </button>
    {:else if isEnrolled}
      <button 
        class="btn btn-enrolled" 
        disabled
      >
        ✅ Ya inscrito
      </button>
    {:else if contestStatus.status === 'available'}
      <button 
        on:click={openRegistrationModal} 
        class="btn btn-success"
      >
        📝 Inscribirse
      </button>
    {:else if contestStatus.status === 'closed'}
      <button 
        class="btn btn-disabled" 
        disabled
      >
        🔒 Inscripciones Cerradas
      </button>
    {:else if contestStatus.status === 'unknown'}
      <button 
        class="btn btn-disabled" 
        disabled
      >
        ❓ Estado desconocido
      </button>
    {/if}
  </div>
</div>
{/if}

{#if showModal}
<div class="modal-overlay" on:click={closeModal}>
  <div class="modal-content" on:click|stopPropagation>
    <div class="modal-header">
      <h3>Inscripción a {contest.name}</h3>
      <button class="close-btn" on:click={closeModal}>&times;</button>
    </div>
    
    <form class="registration-form" on:submit|preventDefault={submitRegistration}>
      <div class="form-group">
        <label for="campus">Campus *</label>
        <select id="campus" bind:value={selectedCampus} required>
          <option value="">-- Selecciona un campus --</option>
          {#each contest.campuses || [] as campus}
            <option value={campus.id}>{campus.name}</option>
          {/each}
        </select>
      </div>

      <div class="form-group">
        <label for="grade">Nivel *</label>
        <select id="grade" bind:value={selectedGrade} required>
          <option value="">-- Selecciona un nivel --</option>
          {#each grades as grade}
            <option value={grade.value}>{grade.label}</option>
          {/each}
        </select>
      </div>

      <div class="modal-actions">
        <button type="button" class="btn btn-secondary" on:click={closeModal}>
          Cancelar
        </button>
        <button type="submit" class="btn btn-success">
          Confirmar Inscripción
        </button>
      </div>
    </form>
  </div>
</div>
{/if}

<style>
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
  
  .form-group select {
    padding: 0.75rem;
    border-radius: 8px;
    border: 2px solid #e1e5e9;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    background-color: white;
  }
  
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
  
  .status-unknown {
    background-color: #fff3e0;
    color: #ef6c00;
  }
  
  .contest-card {
    background: white;
    border: 2px solid #e1e5e9;
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(59, 57, 54, 0.1);
  }
  
  .contest-card:hover {
    border-color: #4CAF50;
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
    color: #333;
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
  
  .contest-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
    font-size: 0.875rem;
    color: #666;
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
    background-color: #f8f9fa;
    border-radius: 8px;
  }
  
  .contest-description p {
    margin: 0;
    color: #666;
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
    color: #333;
    min-width: 100px;
  }
  
  .detail-value {
    color: #666;
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
  
  .contest-actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  
  .btn {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  
  .btn-success {
    background-color: #4CAF50;
    color: white;
    border: 2px solid #4CAF50;
  }
  
  .btn-success:hover {
    background-color: #45a049;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  }
  
  .btn-secondary {
    background-color: transparent;
    color: #4CAF50;
    border: 2px solid #4CAF50;
  }
  
  .btn-secondary:hover {
    background-color: #4CAF50;
    color: white;
  }
  
  .btn-disabled {
    background-color: #6c757d;
    color: white;
    border: 2px solid #6c757d;
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  .btn-disabled:hover {
    transform: none;
    box-shadow: none;
  }
  
  .btn-enrolled {
    background-color: #28a745;
    color: white;
    border: 2px solid #28a745;
    cursor: default;
    opacity: 0.8;
  }
  
  .btn-enrolled:hover {
    transform: none;
    box-shadow: none;
    background-color: #28a745;
  }
  
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