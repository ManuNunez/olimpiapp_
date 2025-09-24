<!-- ProfileInfoCard.svelte -->
<script>
  import { onMount } from 'svelte';
  import { auth } from '../api.js'; // Ajusta la ruta según tu estructura
  
  export let user = null;
  export let userId = null; // Nuevo: permite especificar un usuario específico
  export let onUserUpdated = () => {}; // Callback para notificar cambios al componente padre
  export let onUserDeleted = () => {}; // Nuevo: callback para notificar eliminación
  export let onUserRestored = () => {}; // Nuevo: callback para notificar restauración
  export let isAdminView = false; // Nuevo: determina si es vista de administrador
  export let showActions = true; // Nuevo: controla si mostrar acciones de administrador
  
  let isEditing = false;
  let isUpdating = false;
  let isLoading = false;
  let isDeleting = false;
  let isRestoring = false;
  let error = '';
  let editForm = {};
  let roles = {
    isStudent: false,
    isTeacher: false
  };

  // Computed properties
  $: isOwnProfile = user && auth.getCurrentUser()?.id === user.id;
  $: canEdit = isOwnProfile || isAdminView;
  $: canDelete = isAdminView && !isOwnProfile && user?.status === 1;
  $: canRestore = isAdminView && user?.status === 0;

  onMount(async () => {
    if (userId && !user) {
      // Si se proporciona userId, cargar ese usuario específico
      await loadSpecificUser(userId);
    } else if (!user) {
      // Si no hay usuario, cargar el perfil del usuario autenticado
      await loadUserData();
    } else {
      // Si ya hay usuario, solo cargar sus roles
      await loadUserRoles();
    }
  });

  async function loadSpecificUser(id) {
    try {
      isLoading = true;
      error = '';
      
      user = await auth.getUser(id);
      await loadUserRoles();
      onUserUpdated(user);
    } catch (err) {
      error = `Error al cargar el usuario: ${err.message}`;
      console.error('Error loading specific user:', err);
    } finally {
      isLoading = false;
    }
  }

  async function loadUserData() {
    try {
      isLoading = true;
      error = '';
      
      if (!auth.isLoggedIn()) {
        error = 'No hay sesión activa';
        return;
      }

      user = await auth.me();
      await loadUserRoles();
      onUserUpdated(user);
    } catch (err) {
      error = `Error al cargar el perfil: ${err.message}`;
      console.error('Error loading user data:', err);
    } finally {
      isLoading = false;
    }
  }

  async function loadUserRoles() {
    if (!user?.id) return;
    
    try {
      const roleData = await auth.checkMultipleRoles(user.id);
      if (roleData.success) {
        roles = {
          isStudent: roleData.isStudent,
          isTeacher: roleData.isTeacher
        };
      }
    } catch (err) {
      console.error('Error loading user roles:', err);
    }
  }

  function onStartEditing() {
    editForm = { ...user };
    isEditing = true;
    error = '';
  }

  function onCancelEditing() {
    isEditing = false;
    editForm = {};
    error = '';
  }

  async function onUpdateProfile() {
    try {
      isUpdating = true;
      error = '';

      // Filtrar solo los campos que se pueden editar
      const updatableFields = {};
      const editableFields = ['name', 'email', 'username', 'phone', 'address', 'bio', 'date_of_birth', 'gender', 'occupation', 'website'];
      
      editableFields.forEach(field => {
        if (editForm.hasOwnProperty(field)) {
          updatableFields[field] = editForm[field];
        }
      });

      let updatedUser;
      
      if (isOwnProfile) {
        // Actualizar perfil propio
        updatedUser = await auth.updateProfile(updatableFields);
      } else if (isAdminView) {
        // Actualizar usuario como administrador usando la nueva API
        const response = await auth.updateUser(user.id, updatableFields);
        updatedUser = response.data;
      }
      
      // Actualizar el usuario local con los datos recibidos del servidor
      user = { ...user, ...updatedUser };
      
      isEditing = false;
      editForm = {};
      
      // Notificar al componente padre
      onUserUpdated(user);
      
    } catch (err) {
      error = `Error al actualizar el perfil: ${err.message}`;
      console.error('Error updating profile:', err);
    } finally {
      isUpdating = false;
    }
  }

  async function onDeleteUser() {
    if (!confirm('¿Estás seguro de que quieres desactivar este usuario? Esta acción se puede revertir.')) {
      return;
    }

    try {
      isDeleting = true;
      error = '';

      const response = await auth.deleteUser(user.id);
      
      if (response.success) {
        // Actualizar el estado del usuario
        user = { ...user, status: 0 };
        onUserDeleted(user);
      }
      
    } catch (err) {
      error = `Error al desactivar el usuario: ${err.message}`;
      console.error('Error deleting user:', err);
    } finally {
      isDeleting = false;
    }
  }

  async function onRestoreUser() {
    if (!confirm('¿Estás seguro de que quieres reactivar este usuario?')) {
      return;
    }

    try {
      isRestoring = true;
      error = '';

      const response = await auth.restoreUser(user.id);
      
      if (response.success) {
        // Actualizar el estado del usuario
        user = { ...user, status: 1 };
        onUserRestored(user);
      }
      
    } catch (err) {
      error = `Error al reactivar el usuario: ${err.message}`;
      console.error('Error restoring user:', err);
    } finally {
      isRestoring = false;
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatSimpleDate(dateString) {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function getRoleDisplayText() {
    const roleTexts = [];
    if (roles.isStudent) roleTexts.push('Estudiante');
    if (roles.isTeacher) roleTexts.push('Profesor');
    return roleTexts.length > 0 ? roleTexts.join(', ') : 'Sin rol asignado';
  }

  function getStatusDisplayText(status) {
    return status === 1 ? 'Activo' : 'Inactivo';
  }

  function getStatusClass(status) {
    return status === 1 ? 'status-active' : 'status-inactive';
  }

  // Función para obtener todos los campos del usuario excepto el ID
  function getUserFields(user) {
    const fieldsToShow = [
      { key: "name", label: "Nombre", type: "text" },
      { key: "email", label: "Email", type: "email" },
      { key: "username", label: "Usuario", type: "text" },
      { key: "phone", label: "Teléfono", type: "tel" },
      { key: "address", label: "Dirección", type: "text" },
      { key: "bio", label: "Biografía", type: "textarea" },
      { key: "date_of_birth", label: "Fecha de Nacimiento", type: "date" },
      {
        key: "gender",
        label: "Género",
        type: "select",
        options: ["", "masculino", "femenino", "otro"],
      },
      { key: "occupation", label: "Ocupación", type: "text" },
      { key: "website", label: "Sitio Web", type: "url" },
      { key: "role", label: "Rol", type: "computed", readonly: true },
      { key: "status", label: "Estado", type: "status", readonly: true },
      {
        key: "email_verified",
        label: "Email Verificado",
        type: "boolean",
        readonly: true,
      },
      {
        key: "last_login",
        label: "Último Acceso",
        type: "datetime",
        readonly: true,
      },
      {
        key: "created_at",
        label: "Miembro Desde",
        type: "datetime",
        readonly: true,
      },
      {
        key: "updated_at",
        label: "Última Actualización",
        type: "datetime",
        readonly: true,
      },
    ];

    return fieldsToShow.filter(
      (field) =>
        (user.hasOwnProperty(field.key) || field.type === 'computed' || field.type === 'status') &&
        field.key !== "id" &&
        field.key !== "password" &&
        field.key !== "password_hash",
    );
  }

  function getFieldValue(field, user) {
    if (field.type === 'computed' && field.key === 'role') {
      return getRoleDisplayText();
    }
    if (field.type === 'status' && field.key === 'status') {
      return getStatusDisplayText(user.status);
    }
    return user[field.key];
  }
</script>

{#if isLoading}
  <div class="loading-state">
    <p>Cargando información del perfil...</p>
  </div>
{:else if user}
  <div class="profile-card">
    <div class="card-header">
      <div class="header-title">
        <h2>
          {isOwnProfile ? 'Mi Perfil' : 'Información del Usuario'}
          {#if user.status === 0}
            <span class="status-badge inactive">Inactivo</span>
          {/if}
        </h2>
        {#if isAdminView && !isOwnProfile}
          <p class="user-id">ID: {user.id}</p>
        {/if}
      </div>
      <div class="header-actions">
        {#if canEdit && !isEditing}
          <button class="edit-btn" on:click={onStartEditing}>
            {isOwnProfile ? 'Editar Perfil' : 'Editar Usuario'}
          </button>
        {/if}
        {#if showActions && isAdminView && !isOwnProfile}
          {#if canDelete}
            <button 
              class="delete-btn" 
              on:click={onDeleteUser}
              disabled={isDeleting}
            >
              {isDeleting ? 'Desactivando...' : 'Desactivar'}
            </button>
          {/if}
          {#if canRestore}
            <button 
              class="restore-btn" 
              on:click={onRestoreUser}
              disabled={isRestoring}
            >
              {isRestoring ? 'Reactivando...' : 'Reactivar'}
            </button>
          {/if}
        {/if}
      </div>
    </div>

    {#if error}
      <div class="error-message">
        <p>{error}</p>
        {#if !auth.isLoggedIn()}
          <button class="retry-btn" on:click={() => window.location.reload()}>
            Recargar página
          </button>
        {:else}
          <button class="retry-btn" on:click={userId ? () => loadSpecificUser(userId) : loadUserData}>
            Reintentar
          </button>
        {/if}
      </div>
    {/if}

    {#if isEditing}
      <!-- Formulario de edición -->
      <form on:submit|preventDefault={onUpdateProfile} class="edit-form">
        {#each getUserFields(user) as field}
          {#if !field.readonly}
            <div class="form-group">
              <label for={field.key}>{field.label}:</label>

              {#if field.type === "textarea"}
                <textarea
                  id={field.key}
                  bind:value={editForm[field.key]}
                  placeholder={`Tu ${field.label.toLowerCase()}`}
                  rows="3"
                ></textarea>
              {:else if field.type === "select"}
                <select id={field.key} bind:value={editForm[field.key]}>
                  {#each field.options as option}
                    <option value={option}
                      >{option || "Seleccionar..."}</option
                    >
                  {/each}
                </select>
              {:else}
                <input
                  id={field.key}
                  type={field.type}
                  bind:value={editForm[field.key]}
                  placeholder={field.type === "email"
                    ? "tu@email.com"
                    : field.type === "url"
                      ? "https://tusitio.com"
                      : `Tu ${field.label.toLowerCase()}`}
                  required={field.key === "email" || field.key === "name"}
                />
              {/if}
            </div>
          {/if}
        {/each}

        <div class="form-actions">
          <button type="submit" class="save-btn" disabled={isUpdating}>
            {isUpdating ? "Guardando..." : "Guardar Cambios"}
          </button>
          <button
            type="button"
            class="cancel-btn"
            on:click={onCancelEditing}
            disabled={isUpdating}
          >
            Cancelar
          </button>
        </div>
      </form>
    {:else}
      <!-- Vista de información -->
      <div class="profile-info">
        {#each getUserFields(user) as field}
          <div class="info-item">
            <label>{field.label}:</label>
            <span class={field.type === 'status' ? getStatusClass(user.status) : ''}>
              {#if field.type === "boolean"}
                {getFieldValue(field, user) ? "Sí" : "No"}
              {:else if field.type === "datetime"}
                {formatDate(getFieldValue(field, user))}
              {:else if field.type === "date"}
                {formatSimpleDate(getFieldValue(field, user))}
              {:else if field.key === "website" && getFieldValue(field, user)}
                <a
                  href={getFieldValue(field, user)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {getFieldValue(field, user)}
                </a>
              {:else if field.key === "email"}
                <a href={`mailto:${getFieldValue(field, user)}`}>{getFieldValue(field, user)}</a>
              {:else if field.key === "phone" && getFieldValue(field, user)}
                <a href={`tel:${getFieldValue(field, user)}`}>{getFieldValue(field, user)}</a>
              {:else}
                {getFieldValue(field, user) || "No especificado"}
              {/if}
            </span>
          </div>
        {/each}
      </div>
    {/if}
  </div>
{:else if error}
  <div class="error-card">
    <h3>Error al cargar el perfil</h3>
    <p>{error}</p>
    <button class="retry-btn" on:click={userId ? () => loadSpecificUser(userId) : loadUserData}>
      Reintentar
    </button>
  </div>
{/if}

<style>
  .profile-card {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border: 1px solid #e9ecef;
  }

  .loading-state,
  .error-card {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border: 1px solid #e9ecef;
    text-align: center;
  }

  .error-message {
    background: #f8d7da;
    color: #721c24;
    padding: 1rem;
    border-radius: 6px;
    border: 1px solid #f5c6cb;
    margin-bottom: 1rem;
  }

  .error-card {
    border: 1px solid #f5c6cb;
  }

  .error-card h3 {
    color: #721c24;
    margin-bottom: 1rem;
  }

  .retry-btn {
    background: #007bff;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.3s;
    margin-top: 1rem;
  }

  .retry-btn:hover {
    background: #0056b3;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;
    gap: 1rem;
  }

  .header-title h2 {
    margin: 0;
    color: #343a40;
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .header-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .user-id {
    margin: 0.5rem 0 0 0;
    color: #6c757d;
    font-size: 0.9rem;
  }

  .status-badge {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-weight: 600;
    text-transform: uppercase;
  }

  .status-badge.inactive {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }

  .edit-btn,
  .delete-btn,
  .restore-btn {
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.3s;
    font-weight: 500;
  }

  .edit-btn {
    background: #007bff;
    color: white;
  }

  .edit-btn:hover {
    background: #0056b3;
  }

  .delete-btn {
    background: #dc3545;
    color: white;
  }

  .delete-btn:hover {
    background: #c82333;
  }

  .delete-btn:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }

  .restore-btn {
    background: #28a745;
    color: white;
  }

  .restore-btn:hover {
    background: #218838;
  }

  .restore-btn:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }

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
    min-width: 200px;
  }

  .info-item span {
    color: #343a40;
    text-align: right;
    flex: 1;
  }

  .info-item span a {
    color: #007bff;
    text-decoration: none;
  }

  .info-item span a:hover {
    text-decoration: underline;
  }

  .status-active {
    color: #28a745;
    font-weight: 600;
  }

  .status-inactive {
    color: #dc3545;
    font-weight: 600;
  }

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

  .form-group input,
  .form-group textarea,
  .form-group select {
    padding: 0.75rem;
    border: 2px solid #e9ecef;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.3s;
    font-family: inherit;
  }

  .form-group input:focus,
  .form-group textarea:focus,
  .form-group select:focus {
    outline: none;
    border-color: #007bff;
  }

  .form-group textarea {
    resize: vertical;
    min-height: 80px;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }

  .save-btn,
  .cancel-btn {
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

  @media (max-width: 768px) {
    .card-header {
      flex-direction: column;
      align-items: stretch;
    }

    .header-actions {
      justify-content: flex-start;
    }

    .info-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .info-item label {
      min-width: auto;
    }

    .info-item span {
      text-align: left;
    }

    .form-actions {
      justify-content: center;
    }

    .header-title h2 {
      justify-content: flex-start;
    }
  }
</style>