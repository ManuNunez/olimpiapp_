<script>
  import { auth } from "$lib/api.js";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";

  let user = null;
  let isLoading = true;
  let error = null;
  let isUpdating = false;

  // Estados para verificación de roles
  let userRoles = [];
  let isStudent = false;
  let isTeacher = false;
  let isLoadingRoles = true;

  // Estados para edición del perfil
  let isEditing = false;
  let editForm = {
    name: "",
    email: "",
    username: "",
    phone: "",
    address: "",
    bio: "",
    date_of_birth: "",
    gender: "",
    occupation: "",
    website: "",
  };

  // Estados para gestión de alumnos
  let students = [];
  let isLoadingStudents = false;
  let showAddStudentForm = false;
  let newStudent = {
    name: "",
    username: "",
    email: "",
    password: "",
  };

  // Estados para información de escuela (solo para alumnos)
  let schoolInfo = {
    name: "",
    cct: "",
  };
  let isEditingSchool = false;
  let isUpdatingSchool = false;

  onMount(async () => {
    if (browser) {
      // Verificar si está logueado
      if (!auth.isLoggedIn()) {
        goto("/login");
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

      // Verificar roles del usuario
      await loadUserRoles();

      // Inicializar formulario de edición con todos los datos disponibles
      editForm = {
        name: user.name || "",
        email: user.email || "",
        username: user.username || "",
        phone: user.phone || "",
        address: user.address || "",
        bio: user.bio || "",
        date_of_birth: user.date_of_birth || "",
        gender: user.gender || "",
        occupation: user.occupation || "",
        website: user.website || "",
      };

      // Si el usuario es maestro, cargar alumnos
      if (isTeacher) {
        await loadStudents();
      }

      // Si el usuario es alumno, cargar información de la escuela
      if (isStudent) {
        await loadSchoolInfo();
      }
    } catch (err) {
      console.error("Error cargando datos del usuario:", err);
      error = "No se pudieron cargar los datos del usuario";

      // Si el token es inválido, redirigir al login
      if (err.message.includes("401") || err.message.includes("Unauthorized")) {
        handleLogout();
      }
    } finally {
      isLoading = false;
    }
  }

  async function loadUserRoles() {
    try {
      isLoadingRoles = true;

      if (!user?.id) {
        throw new Error("Usuario no encontrado");
      }

      // Obtener roles del usuario
      const rolesResponse = await auth.getUserRoles(user.id);

      if (rolesResponse.success) {
        userRoles = rolesResponse.roles;

        // Verificar roles específicos
        const studentCheck = await auth.checkUserHasRole(
          user.id,
          auth.ROLES.STUDENT,
        );
        const teacherCheck = await auth.checkUserHasRole(
          user.id,
          auth.ROLES.TEACHER,
        );

        isStudent = studentCheck.success && studentCheck.has_role;
        isTeacher = teacherCheck.success && teacherCheck.has_role;

        console.log("Roles del usuario:", {
          roles: userRoles,
          isStudent,
          isTeacher,
        });
      } else {
        console.warn("No se pudieron obtener los roles del usuario");
        userRoles = [];
        isStudent = false;
        isTeacher = false;
      }
    } catch (err) {
      console.error("Error cargando roles del usuario:", err);
      // En caso de error, usar valores por defecto
      userRoles = [];
      isStudent = false;
      isTeacher = false;
    } finally {
      isLoadingRoles = false;
    }
  }

  async function loadStudents() {
    try {
      isLoadingStudents = true;
      // Aquí deberías hacer la llamada a tu API para obtener los alumnos
      // students = await auth.getStudents();

      // Datos de ejemplo mientras implementas la API
      students = [
        {
          id: 1,
          name: "Juan Pérez",
          username: "juan.perez",
          email: "juan@example.com",
        },
        {
          id: 2,
          name: "María García",
          username: "maria.garcia",
          email: "maria@example.com",
        },
        {
          id: 3,
          name: "Carlos López",
          username: "carlos.lopez",
          email: "carlos@example.com",
        },
      ];
    } catch (err) {
      console.error("Error cargando alumnos:", err);
    } finally {
      isLoadingStudents = false;
    }
  }

  async function loadSchoolInfo() {
    try {
      // Aquí deberías hacer la llamada a tu API para obtener la info de la escuela
      // const school = await auth.getSchoolInfo();

      // Datos de ejemplo mientras implementas la API
      schoolInfo = {
        name: "Escuela Primaria Benito Juárez",
        cct: "06DPR0123X",
      };
    } catch (err) {
      console.error("Error cargando información de la escuela:", err);
    }
  }

  async function deleteStudent(studentId) {
    if (!isTeacher) {
      alert("No tienes permisos para eliminar alumnos");
      return;
    }

    if (!confirm("¿Estás seguro de que quieres eliminar este alumno?")) {
      return;
    }

    try {
      // Aquí deberías hacer la llamada a tu API para eliminar el alumno
      // await auth.deleteStudent(studentId);

      // Por ahora solo lo quitamos del array local
      students = students.filter((student) => student.id !== studentId);
      alert("Alumno eliminado correctamente");
    } catch (err) {
      console.error("Error eliminando alumno:", err);
      alert("Error al eliminar el alumno");
    }
  }

  async function addStudent() {
    if (!isTeacher) {
      alert("No tienes permisos para agregar alumnos");
      return;
    }

    try {
      // Validar formulario
      if (!newStudent.name || !newStudent.username || !newStudent.email) {
        alert("Por favor completa todos los campos obligatorios");
        return;
      }

      // Aquí deberías hacer la llamada a tu API para crear el alumno
      // const createdStudent = await auth.createStudent(newStudent);

      // Por ahora solo lo agregamos al array local
      const createdStudent = {
        id: Date.now(), // ID temporal
        name: newStudent.name,
        username: newStudent.username,
        email: newStudent.email,
      };

      students = [...students, createdStudent];

      // Limpiar formulario
      newStudent = { name: "", username: "", email: "", password: "" };
      showAddStudentForm = false;

      alert("Alumno agregado correctamente");
    } catch (err) {
      console.error("Error agregando alumno:", err);
      alert("Error al agregar el alumno");
    }
  }

  async function updateSchoolInfo() {
    if (!isStudent) {
      alert("No tienes permisos para actualizar la información de la escuela");
      return;
    }

    try {
      isUpdatingSchool = true;

      // Aquí deberías hacer la llamada a tu API para actualizar la info de la escuela
      // await auth.updateSchoolInfo(schoolInfo);

      isEditingSchool = false;
      alert("Información de la escuela actualizada correctamente");
    } catch (err) {
      console.error("Error actualizando información de la escuela:", err);
      alert("Error al actualizar la información de la escuela");
    } finally {
      isUpdatingSchool = false;
    }
  }

  async function handleLogout() {
    try {
      await auth.logout();
    } catch (err) {
      console.error("Error en logout:", err);
    } finally {
      // Forzar logout local incluso si falla la API
      localStorage.removeItem("auth_token");

      // Redirigir a la página principal y recargar completamente
      window.location.href = "/";
    }
  }

  function startEditing() {
    isEditing = true;
    // Reinicializar el formulario con los datos actuales
    editForm = {
      name: user.name || "",
      email: user.email || "",
      username: user.username || "",
      phone: user.phone || "",
      address: user.address || "",
      bio: user.bio || "",
      date_of_birth: user.date_of_birth ? user.date_of_birth.split("T")[0] : "",
      gender: user.gender || "",
      occupation: user.occupation || "",
      website: user.website || "",
    };
  }

  function cancelEditing() {
    isEditing = false;
    editForm = {
      name: user.name || "",
      email: user.email || "",
      username: user.username || "",
      phone: user.phone || "",
      address: user.address || "",
      bio: user.bio || "",
      date_of_birth: user.date_of_birth ? user.date_of_birth.split("T")[0] : "",
      gender: user.gender || "",
      occupation: user.occupation || "",
      website: user.website || "",
    };
  }

  async function handleUpdateProfile() {
    try {
      isUpdating = true;
      error = null;

      const updatedUser = await auth.updateProfile(editForm);

      user = updatedUser;
      isEditing = false;

      // Mostrar mensaje de éxito
      alert("Perfil actualizado correctamente");
    } catch (err) {
      console.error("Error actualizando perfil:", err);
      error = "Error al actualizar el perfil";
    } finally {
      isUpdating = false;
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

<svelte:head>
  <title>Mi Cuenta - OlimpiApp</title>
</svelte:head>

<div class="account-container">
  <div class="account-header">
    <h1>Mi Cuenta</h1>
    <button class="logout-btn" on:click={handleLogout}> Cerrar Sesión </button>
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
        <button class="retry-btn" on:click={loadUserData}> Reintentar </button>
      </div>
    </div>
  {:else if user}
    <div class="user-profile">
      <!-- Información de roles -->
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

      <!-- Información básica -->
      <div class="profile-card">
        <div class="card-header">
          <h2>Información Personal</h2>
          {#if !isEditing}
            <button class="edit-btn" on:click={startEditing}>
              Editar Perfil
            </button>
          {/if}
        </div>

        {#if isEditing}
          <!-- Formulario de edición -->
          <form
            on:submit|preventDefault={handleUpdateProfile}
            class="edit-form"
          >
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
                on:click={cancelEditing}
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

      <!-- Gestión de Alumnos (solo para maestros) -->
      {#if isTeacher}
        <div class="students-card">
          <div class="card-header">
            <h2>Gestión de Alumnos</h2>
            <button
              class="add-btn"
              on:click={() => (showAddStudentForm = !showAddStudentForm)}
            >
              {showAddStudentForm ? "Cancelar" : "Agregar Alumno"}
            </button>
          </div>

          {#if showAddStudentForm}
            <form
              on:submit|preventDefault={addStudent}
              class="add-student-form"
            >
              <div class="form-row">
                <div class="form-group">
                  <label for="student-name">Nombre:</label>
                  <input
                    id="student-name"
                    type="text"
                    bind:value={newStudent.name}
                    placeholder="Nombre completo del alumno"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="student-username">Usuario:</label>
                  <input
                    id="student-username"
                    type="text"
                    bind:value={newStudent.username}
                    placeholder="nombre.usuario"
                    required
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="student-email">Email:</label>
                  <input
                    id="student-email"
                    type="email"
                    bind:value={newStudent.email}
                    placeholder="alumno@escuela.edu"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="student-password">Contraseña:</label>
                  <input
                    id="student-password"
                    type="password"
                    bind:value={newStudent.password}
                    placeholder="Contraseña temporal"
                    required
                  />
                </div>
              </div>
              <button type="submit" class="save-btn">Agregar Alumno</button>
            </form>
          {/if}

          {#if isLoadingStudents}
            <div class="loading-students">
              <div class="loading-spinner"></div>
              <p>Cargando alumnos...</p>
            </div>
          {:else if students.length > 0}
            <div class="students-table-container">
              <table class="students-table">
                <thead>
                  <tr>
                    <th>Número</th>
                    <th>Nombre</th>
                    <th>Usuario</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {#each students as student, index}
                    <tr>
                      <td>{index + 1}</td>
                      <td>{student.name}</td>
                      <td>{student.username}</td>
                      <td>
                        <button
                          class="delete-btn"
                          on:click={() => deleteStudent(student.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          {:else}
            <div class="no-students">
              <p>No hay alumnos registrados aún.</p>
            </div>
          {/if}
        </div>
      {/if}

      <!-- Información de la Escuela (solo para alumnos) -->
      {#if isStudent}
        <div class="school-card">
          <div class="card-header">
            <h2>Información de la Escuela</h2>
            <button
              class="edit-btn"
              on:click={() => (isEditingSchool = !isEditingSchool)}
            >
              {isEditingSchool ? "Cancelar" : "Editar CCT"}
            </button>
          </div>

          {#if isEditingSchool}
            <form
              on:submit|preventDefault={updateSchoolInfo}
              class="edit-school-form"
            >
              <div class="form-group">
                <label for="school-name">Nombre de la Escuela:</label>
                <input
                  id="school-name"
                  type="text"
                  value={schoolInfo.name}
                  placeholder="Nombre completo de la escuela"
                  disabled
                  class="disabled-field"
                />
                <small class="field-note"
                  >El nombre de la escuela no puede ser modificado</small
                >
              </div>
              <div class="form-group">
                <label for="school-cct">CCT (Clave de Centro de Trabajo):</label
                >
                <input
                  id="school-cct"
                  type="text"
                  bind:value={schoolInfo.cct}
                  placeholder="Ej: 06DPR0123X"
                  pattern="[0-9]{2}[A-Z]{3}[0-9]{4}[A-Z]{1}"
                  title="Formato: 06DPR0123X"
                  required
                />
              </div>
              <div class="form-actions">
                <button
                  type="submit"
                  class="save-btn"
                  disabled={isUpdatingSchool}
                >
                  {isUpdatingSchool ? "Guardando..." : "Guardar CCT"}
                </button>
              </div>
            </form>
          {:else}
            <div class="school-info">
              <div class="info-item">
                <label>Nombre de la Escuela:</label>
                <span>{schoolInfo.name || "No especificado"}</span>
              </div>
              <div class="info-item">
                <label>CCT:</label>
                <span class="cct-display"
                  >{schoolInfo.cct || "No especificado"}</span
                >
              </div>
            </div>
          {/if}
        </div>
      {/if}

      <!-- Mensaje para usuarios sin roles específicos -->
      {#if !isStudent && !isTeacher && !isLoadingRoles}
        <div class="no-role-card">
          <div class="card-header">
            <h2>Acceso Limitado</h2>
          </div>
          <div class="no-role-content">
            <p>
              Tu cuenta no tiene roles específicos asignados que te permitan
              acceder a funciones adicionales.
            </p>
            <p>Contacta al administrador si necesitas permisos especiales.</p>
          </div>
        </div>
      {/if}

      <!-- Estadísticas adicionales si están disponibles -->
      {#if user.stats}
        <div class="stats-card">
          <div class="card-header">
            <h2>Estadísticas</h2>
          </div>
          <div class="stats-grid">
            {#each Object.entries(user.stats) as [key, value]}
              <div class="stat-item">
                <span class="stat-value">{value}</span>
                <span class="stat-label">{key.replace(/_/g, " ")}</span>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Acciones adicionales -->
      <div class="actions-card">
        <div class="card-header">
          <h2>Acciones de Cuenta</h2>
        </div>
        <div class="action-buttons">
          <button
            class="action-btn secondary"
            on:click={() => goto("/settings")}
          >
            Configuración
          </button>
          <button
            class="action-btn secondary"
            on:click={() => goto("/privacy")}
          >
            Privacidad
          </button>
          <button
            class="action-btn danger"
            on:click={() => {
              if (
                confirm(
                  "¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.",
                )
              ) {
                // Implementar eliminación de cuenta
                console.log("Eliminar cuenta");
              }
            }}
          >
            Eliminar Cuenta
          </button>
        </div>
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
  .loading-container,
  .loading-students {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 0;
  }

  .loading-students {
    padding: 2rem 0;
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
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
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

  .profile-card,
  .stats-card,
  .actions-card,
  .students-card,
  .school-card,
  .roles-card,
  .no-role-card {
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

  .edit-btn,
  .add-btn {
    background: #007bff;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.3s;
  }

  .edit-btn:hover,
  .add-btn:hover {
    background: #0056b3;
  }

  /* Roles Card */
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

  .no-roles,
  .no-role-content {
    text-align: center;
    padding: 2rem;
    color: #6c757d;
    background: #f8f9fa;
    border-radius: 8px;
  }

  /* Profile Info */
  .profile-info,
  .school-info {
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

  .cct-display {
    font-family: "Courier New", monospace !important;
    font-weight: 500 !important;
    background-color: #f8f9fa !important;
    padding: 0.25rem 0.5rem !important;
    border-radius: 4px !important;
    border: 1px solid #dee2e6 !important;
  }

  /* Students Table */
  .students-table-container {
    overflow-x: auto;
    margin-top: 1rem;
  }

  .students-table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .students-table th,
  .students-table td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #dee2e6;
  }

  .students-table th {
    background: #f8f9fa;
    font-weight: 600;
    color: #495057;
  }

  .students-table tbody tr:hover {
    background: #f8f9fa;
  }

  .delete-btn {
    background: #dc3545;
    color: white;
    border: none;
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: background-color 0.3s;
  }

  .delete-btn:hover {
    background: #c82333;
  }

  .no-students {
    text-align: center;
    padding: 2rem;
    color: #6c757d;
    background: #f8f9fa;
    border-radius: 8px;
    margin-top: 1rem;
  }

  /* Add Student Form */
  .add-student-form,
  .edit-school-form {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  /* Edit Form */
  .edit-form,
  .edit-school-form {
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

  .disabled-field {
    background-color: #f8f9fa !important;
    color: #6c757d !important;
    cursor: not-allowed !important;
    border-color: #e9ecef !important;
  }

  .disabled-field:focus {
    border-color: #e9ecef !important;
    box-shadow: none !important;
  }

  .field-note {
    color: #6c757d;
    font-size: 0.85rem;
    margin-top: 0.25rem;
    font-style: italic;
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

    .info-item label {
      min-width: auto;
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

    .form-row {
      grid-template-columns: 1fr;
    }

    .students-table-container {
      font-size: 0.9rem;
    }

    .students-table th,
    .students-table td {
      padding: 0.5rem;
    }

    .role-status {
      flex-direction: column;
    }

    .roles-list ul {
      justify-content: center;
    }
  }
</style>
