<!-- StudentsManagementCard.svelte -->
<script>
  export let students = [];
  export let isLoadingStudents = false;
  export let showAddStudentForm = false;
  export let newStudent = {
    name: "",
    username: "",
    email: "",
    password: "",
  };
  
  export let onAddStudent = () => {};
  export let onDeleteStudent = (studentId) => {};
  export let onToggleAddForm = () => {};

  function handleAddStudent() {
    onAddStudent();
  }

  function handleDeleteStudent(studentId) {
    if (confirm("¿Estás seguro de que quieres eliminar este alumno?")) {
      onDeleteStudent(studentId);
    }
  }
</script>

<div class="students-card">
  <div class="card-header">
    <h2>Gestión de Alumnos</h2>
    <button
      class="add-btn"
      on:click={onToggleAddForm}
    >
      {showAddStudentForm ? "Cancelar" : "Agregar Alumno"}
    </button>
  </div>

  {#if showAddStudentForm}
    <form
      on:submit|preventDefault={handleAddStudent}
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
                  on:click={() => handleDeleteStudent(student.id)}
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

<style>
  .students-card {
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

  .add-btn:hover {
    background: #0056b3;
  }

  .loading-students {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .add-student-form {
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
    font-family: inherit;
  }

  .form-group input:focus {
    outline: none;
    border-color: #007bff;
  }

  .save-btn {
    background: #28a745;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: background-color 0.3s;
  }

  .save-btn:hover {
    background: #218838;
  }

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

  @media (max-width: 768px) {
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
  }
</style>