<!-- SchoolInfoCard.svelte -->
<script>
  export let schoolInfo = {
    name: "",
    cct: "",
  };
  export let isEditingSchool = false;
  export let isUpdatingSchool = false;
  
  export let onToggleEdit = () => {};
  export let onUpdateSchoolInfo = () => {};
</script>

<div class="school-card">
  <div class="card-header">
    <h2>Información de la Escuela</h2>
    <button
      class="edit-btn"
      on:click={onToggleEdit}
    >
      {isEditingSchool ? "Cancelar" : "Editar CCT"}
    </button>
  </div>

  {#if isEditingSchool}
    <form
      on:submit|preventDefault={onUpdateSchoolInfo}
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
        <label for="school-cct">CCT (Clave de Centro de Trabajo):</label>
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

<style>
  .school-card {
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
    }
    .cct-display {
        font-family: 'Courier New', Courier, monospace;
        background-color: #f1f3f5;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
    }
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
</style>