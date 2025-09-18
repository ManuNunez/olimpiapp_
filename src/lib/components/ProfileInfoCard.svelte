<!-- ProfileInfoCard.svelte -->
<script>
  export let user;
  export let isEditing = false;
  export let isUpdating = false;
  export let editForm = {};
  
  export let onStartEditing = () => {};
  export let onCancelEditing = () => {};
  export let onUpdateProfile = () => {};

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
      { key: "role", label: "Rol", type: "text", readonly: true },
      { key: "status", label: "Estado", type: "text", readonly: true },
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
        user.hasOwnProperty(field.key) &&
        field.key !== "id" &&
        field.key !== "password" &&
        field.key !== "password_hash",
    );
  }
</script>

<div class="profile-card">
  <div class="card-header">
    <h2>Información Personal</h2>
    {#if !isEditing}
      <button class="edit-btn" on:click={onStartEditing}>
        Editar Perfil
      </button>
    {/if}
  </div>

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
          <span>
            {#if field.type === "boolean"}
              {user[field.key] ? "Sí" : "No"}
            {:else if field.type === "datetime"}
              {formatDate(user[field.key])}
            {:else if field.type === "date"}
              {formatSimpleDate(user[field.key])}
            {:else if field.key === "website" && user[field.key]}
              <a
                href={user[field.key]}
                target="_blank"
                rel="noopener noreferrer"
              >
                {user[field.key]}
              </a>
            {:else if field.key === "email"}
              <a href={`mailto:${user[field.key]}`}>{user[field.key]}</a>
            {:else if field.key === "phone" && user[field.key]}
              <a href={`tel:${user[field.key]}`}>{user[field.key]}</a>
            {:else}
              {user[field.key] || "No especificado"}
            {/if}
          </span>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .profile-card {
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
    transition: background-color 0.3s;
  }

  .edit-btn:hover {
    background: #0056b3;
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
  }
</style>