<!-- routes/account/+page.svelte -->
<script>
  import { auth } from "$lib/api.js";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";

  // Importar componentes
  import UserRolesCard from "$lib/components/UserRolesCard.svelte";
  import ProfileInfoCard from "$lib/components/ProfileInfoCard.svelte";
  import StudentsManagementCard from "$lib/components/StudentsManagementCard.svelte";
  import SchoolInfoCard from "$lib/components/SchoolInfoCard.svelte";

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

  // Handlers para ProfileInfoCard
  function handleStartEditing() {
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

  function handleCancelEditing() {
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

  // Handlers para StudentsManagementCard
  function handleToggleAddStudentForm() {
    showAddStudentForm = !showAddStudentForm;
    if (!showAddStudentForm) {
      // Limpiar formulario al cerrar
      newStudent = { name: "", username: "", email: "", password: "" };
    }
  }

  async function handleAddStudent() {
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

  async function handleDeleteStudent(studentId) {
    if (!isTeacher) {
      alert("No tienes permisos para eliminar alumnos");
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

  // Handlers para SchoolInfoCard
  function handleToggleSchoolEdit() {
    isEditingSchool = !isEditingSchool;
  }

  async function handleUpdateSchoolInfo() {
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
      <UserRolesCard 
        {userRoles}
        {isStudent}
        {isTeacher}
        {isLoadingRoles}
      />

      <!-- Información básica -->
      <ProfileInfoCard 
        {user}
        {isEditing}
        {isUpdating}
        {editForm}
        onStartEditing={handleStartEditing}
        onCancelEditing={handleCancelEditing}
        onUpdateProfile={handleUpdateProfile}
      />

      <!-- Gestión de Alumnos (solo para maestros) -->
      <!-- {#if isTeacher}
        <StudentsManagementCard 
          {students}
          {isLoadingStudents}
          {showAddStudentForm}
          {newStudent}
          onAddStudent={handleAddStudent}
          onDeleteStudent={handleDeleteStudent}
          onToggleAddForm={handleToggleAddStudentForm}
        />
      {/if} -->

      <!-- Información de la Escuela (solo para alumnos) -->
      {#if isStudent}
        <SchoolInfoCard 
          {schoolInfo}
          {isEditingSchool}
          {isUpdatingSchool}
          onToggleEdit={handleToggleSchoolEdit}
          onUpdateSchoolInfo={handleUpdateSchoolInfo}
        />
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

  .no-role-card,
  .stats-card,
  .actions-card {
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

  .no-role-content {
    text-align: center;
    padding: 2rem;
    color: #6c757d;
    background: #f8f9fa;
    border-radius: 8px;
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

    .action-buttons {
      justify-content: center;
    }
  }
</style>