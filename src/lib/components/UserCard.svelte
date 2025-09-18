<!-- UserRolesCard.svelte -->
<script>
  export let userRoles = [];
  export let isStudent = false;
  export let isTeacher = false;
  export let isLoadingRoles = false;

  // Función helper para obtener el nombre de los roles
  function getRoleName(roleId) {
    switch (roleId) {
      case 2:
        return "Estudiante";
      case 3:
        return "Maestro";
      default:
        return `Rol ${roleId}`;
    }
  }
</script>

{#if isLoadingRoles}
  <div class="roles-card">
    <div class="card-header">
      <h2>Verificando roles...</h2>
    </div>
    <div class="loading-spinner"></div>
  </div>
{:else}
  <div class="roles-card">
    <div class="card-header">
      <h2>Roles del Usuario</h2>
    </div>
    <div class="roles-info">
      {#if userRoles.length > 0}
        <div class="roles-list">
          <p><strong>Roles asignados:</strong></p>
          <ul>
            {#each userRoles as role}
              <li class="role-item">
                <span
                  class="role-badge"
                  class:student={role.id === 2}
                  class:teacher={role.id === 3}
                >
                  {getRoleName(role.id)}
                </span>
              </li>
            {/each}
          </ul>
        </div>
        <div class="role-status">
          <div class="status-item" class:active={isStudent}>
            <span class="status-indicator"></span>
            Estudiante
          </div>
          <div class="status-item" class:active={isTeacher}>
            <span class="status-indicator"></span>
            Maestro
          </div>
        </div>
      {:else}
        <div class="no-roles">
          <p>No se encontraron roles asignados para este usuario.</p>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .roles-card {
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

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .roles-info {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .roles-list ul {
    list-style: none;
    padding: 0;
    margin: 0.5rem 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .role-item {
    display: inline-block;
  }

  .role-badge {
    display: inline-block;
    padding: 0.4rem 0.8rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
    background: #6c757d;
    color: white;
  }

  .role-badge.student {
    background: #28a745;
  }

  .role-badge.teacher {
    background: #007bff;
  }

  .role-status {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
  }

  .status-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    background: white;
    border: 2px solid #dee2e6;
    color: #6c757d;
    transition: all 0.3s;
  }

  .status-item.active {
    border-color: #28a745;
    color: #155724;
    background: #d4edda;
  }

  .status-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #6c757d;
    transition: background-color 0.3s;
  }

  .status-item.active .status-indicator {
    background: #28a745;
  }

  .no-roles {
    text-align: center;
    padding: 2rem;
    color: #6c757d;
    background: #f8f9fa;
    border-radius: 8px;
  }

  @media (max-width: 768px) {
    .role-status {
      flex-direction: column;
    }

    .roles-list ul {
      justify-content: center;
    }
  }
</style>