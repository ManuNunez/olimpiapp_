<script>
  import { auth } from '$lib/api.js';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  
  let user = null;
  let isLoading = true;
  let error = null;
  let isUpdating = false;

  // Estados para edición
  let isEditing = false;
  let editForm = {
    name: '',
    email: ''
  };

  onMount(async () => {
    if (browser) {
      // Verificar si está logueado
      if (!auth.isLoggedIn()) {
        goto('/login');
        return;
      }

      await loadUserData();
    }
  });

  async function loadUserData() {
    try {
      isLoading = true;
      error = null;
      user = await auth.me();
      
      // Inicializar formulario de edición
      editForm = {
        name: user.name || '',
        email: user.email || ''
      };
    } catch (err) {
      console.error('Error cargando datos del usuario:', err);
      error = 'No se pudieron cargar los datos del usuario';
      
      // Si el token es inválido, redirigir al login
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        handleLogout();
      }
    } finally {
      isLoading = false;
    }
  }

  async function handleLogout() {
    try {
      await auth.logout();
    } catch (err) {
      console.error('Error en logout:', err);
    } finally {
      // Forzar logout local incluso si falla la API
      localStorage.removeItem('auth_token');
      goto('/login');
    }
  }

  function startEditing() {
    isEditing = true;
    editForm = {
      name: user.name || '',
      email: user.email || ''
    };
  }

  function cancelEditing() {
    isEditing = false;
    editForm = {
      name: user.name || '',
      email: user.email || ''
    };
  }

  async function handleUpdateProfile() {
    try {
      isUpdating = true;
      error = null;
      
      // Aquí asumo que tienes un endpoint para actualizar perfil
      // Ajusta según tu API
      const updatedUser = await auth.updateProfile(editForm);
      
      user = updatedUser;
      isEditing = false;
      
      // Mostrar mensaje de éxito (opcional)
      alert('Perfil actualizado correctamente');
    } catch (err) {
      console.error('Error actualizando perfil:', err);
      error = 'Error al actualizar el perfil';
    } finally {
      isUpdating = false;
    }
  }

  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
</script>

<svelte:head>
  <title>Mi Cuenta - OlimpiApp</title>
</svelte:head>

<div class="account-container">
  <div class="account-header">
    <h1>Mi Cuenta</h1>
    <button class="logout-btn" on:click={handleLogout}>
      Cerrar Sesión
    </button>
  </div>

  {#if isLoading}
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p>Cargando información del usuario...</p>
    </div>
  {:else if error}
    <div class="error-container">
      <div class="error-message">
        <h3>Error</h3>
        <p>{error}</p>
        <button class="retry-btn" on:click={loadUserData}>
          Reintentar
        </button>
      </div>
    </div>
  {:else if user}
    <div class="user-profile">
      <!-- Información básica -->
      <div class="profile-card">
        <div class="card-header">
          <h2>Información Personal</h2>
        </div>

        {#if isEditing}
          <!-- Formulario de edición -->
          <form on:submit|preventDefault={handleUpdateProfile} class="edit-form">
            <div class="form-group">
              <label for="name">Nombre:</label>
              <input 
                id="name"
                type="text" 
                bind:value={editForm.name}
                placeholder="Tu nombre completo"
                required
              />
            </div>

            <div class="form-group">
              <label for="email">Email:</label>
              <input 
                id="email"
                type="email" 
                bind:value={editForm.email}
                placeholder="tu@email.com"
                required
              />
            </div>

            <div class="form-actions">
              <button type="submit" class="save-btn" disabled={isUpdating}>
                {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button type="button" class="cancel-btn" on:click={cancelEditing} disabled={isUpdating}>
                Cancelar
              </button>
            </div>
          </form>
        {:else}
          <!-- Vista de información -->
          <div class="profile-info">
            <div class="info-item">
              <label>Nombre:</label>
              <span>{user.name || 'No especificado'}</span>
            </div>

            <div class="info-item">
              <label>Email:</label>
              <span>{user.email}</span>
            </div>

            {#if user.created_at}
              <div class="info-item">
                <label>Miembro desde:</label>
                <span>{formatDate(user.created_at)}</span>
              </div>
            {/if}

            {#if user.updated_at}
              <div class="info-item">
                <label>Última actualización:</label>
                <span>{formatDate(user.updated_at)}</span>
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .account-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    min-height: 100vh;
  }

  .account-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #e9ecef;
  }

  .account-header h1 {
    margin: 0;
    color: #343a40;
    font-size: 2rem;
  }

  .logout-btn {
    background: #dc3545;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.3s;
  }

  .logout-btn:hover {
    background: #c82333;
  }

  /* Loading */
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 0;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Error */
  .error-container {
    display: flex;
    justify-content: center;
    padding: 2rem 0;
  }

  .error-message {
    background: #f8d7da;
    color: #721c24;
    padding: 2rem;
    border-radius: 8px;
    border: 1px solid #f5c6cb;
    text-align: center;
  }

  .retry-btn {
    background: #007bff;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 1rem;
  }

  /* Profile Cards */
  .user-profile {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .profile-card, .stats-card, .actions-card {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border: 1px solid #e9ecef;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .card-header h2 {
    margin: 0;
    color: #343a40;
  }

  .edit-btn {
    background: #007bff;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
  }

  /* Profile Info */
  .profile-info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid #f8f9fa;
  }

  .info-item label {
    font-weight: 600;
    color: #495057;
    min-width: 150px;
  }

  .info-item span {
    color: #343a40;
    text-align: right;
  }

  /* Edit Form */
  .edit-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-group label {
    font-weight: 600;
    color: #495057;
  }

  .form-group input {
    padding: 0.75rem;
    border: 2px solid #e9ecef;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.3s;
  }

  .form-group input:focus {
    outline: none;
    border-color: #007bff;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }

  .save-btn, .cancel-btn {
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: background-color 0.3s;
  }

  .save-btn {
    background: #28a745;
    color: white;
  }

  .save-btn:hover {
    background: #218838;
  }

  .save-btn:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }

  .cancel-btn {
    background: #6c757d;
    color: white;
  }

  .cancel-btn:hover {
    background: #5a6268;
  }

  /* Stats */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .stat-item {
    text-align: center;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
  }

  .stat-value {
    display: block;
    font-size: 1.5rem;
    font-weight: bold;
    color: #007bff;
  }

  .stat-label {
    font-size: 0.9rem;
    color: #6c757d;
    text-transform: capitalize;
  }

  /* Action Buttons */
  .action-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .action-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.3s;
  }

  .action-btn.secondary {
    background: #6c757d;
    color: white;
  }

  .action-btn.secondary:hover {
    background: #5a6268;
  }

  .action-btn.danger {
    background: #dc3545;
    color: white;
  }

  .action-btn.danger:hover {
    background: #c82333;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .account-container {
      padding: 1rem;
    }

    .account-header {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }

    .info-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .info-item span {
      text-align: left;
    }

    .form-actions {
      justify-content: center;
    }

    .action-buttons {
      justify-content: center;
    }
  }
</style>