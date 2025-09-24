<script>
  import { onMount, onDestroy } from "svelte";

  export let apiBaseUrl = "http://localhost:8000/api";

  // Estado de autenticación
  let token = "";
  let currentUser = null;

  // Estados principales
  let schoolInfo = {
    id: null,
    name: "",
    cct: "",
  };

  let originalSchoolInfo = {};
  let isEditingSchool = false;
  let isUpdatingSchool = false;
  let hasStudentProfile = false;

  // Estados de UI
  let schoolSuggestions = [];
  let selectedSchoolId = null;
  let isLoading = false;
  let error = null;
  let isSearching = false;

  // Control de requests
  let abortController = null;
  let debounceTimeout = null;

  // Validación de CCT (removida la validación estricta de formato)
  function isValidCCT(cct) {
    return cct?.trim().length > 0;
  }

  // Sanitizar entrada
  function sanitizeInput(input) {
    return input?.toString().trim().toUpperCase() || "";
  }

  // Debounce mejorado con cleanup
  function debounce(func, wait = 300) {
    return (...args) => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => func(...args), wait);
    };
  }

  // Manejo de errores mejorado
  function handleError(err, context) {
    console.error(`Error en ${context}:`, err);

    if (err.name === "AbortError") return;

    if (err.message?.includes("401")) {
      error = "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
      token = "";
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
      }
    } else if (err.message?.includes("404")) {
      error = "No se pudo encontrar el recurso solicitado.";
    } else if (err.message?.includes("422")) {
      error =
        "Los datos enviados no son válidos. Por favor, verifica la información.";
    } else if (err.message?.includes("500")) {
      error = "Error interno del servidor. Por favor, intenta más tarde.";
    } else {
      error = err.message || "Ha ocurrido un error inesperado.";
    }
  }

  // Función para hacer requests con manejo de errores
  async function makeRequest(url, options = {}) {
    if (abortController) abortController.abort();
    abortController = new AbortController();

    console.log("Making request to:", url, "with options:", options); // Debug log

    const response = await fetch(url, {
      ...options,
      signal: abortController.signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      },
    });

    console.log("Response status:", response.status, response.statusText); // Debug log

    if (!response.ok) {
      // Intentar obtener el mensaje de error del servidor
      let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        console.log("Error response data:", errorData); // Debug log
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.errors) {
          errorMessage = Object.values(errorData.errors).flat().join(", ");
        }
      } catch (e) {
        console.log("Could not parse error response as JSON"); // Debug log
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("Response data:", data); // Debug log
    return data;
  }

  // Obtener información del usuario actual
  async function fetchCurrentUser() {
    if (!token) return null;

    try {
      const data = await makeRequest(`${apiBaseUrl}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data && data.id) {
        currentUser = data;
        if (typeof window !== "undefined") {
          localStorage.setItem("current_user", JSON.stringify(data));
        }
        return data;
      }
      return null;
    } catch (err) {
      console.error("Error al obtener usuario actual:", err);
      return null;
    }
  }
  async function fetchStudentProfile() {
    if (!token) return;

    try {
      error = null;
      isLoading = true;

      const data = await makeRequest(`${apiBaseUrl}/student/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success && data.data) {
        hasStudentProfile = true;
        schoolInfo = {
          studentId: data.data.id || null,
          id: data.data.school?.id !== undefined ? data.data.school.id : null,
          name: data.data.school?.name || "",
          cct: data.data.school?.cct || data.data.code || "",
        };
        selectedSchoolId = schoolInfo.id;

        // Guardar en localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "student_profile",
            JSON.stringify({
              schoolInfo,
              hasStudentProfile,
            }),
          );
        }
      } else {
        hasStudentProfile = false;
        schoolInfo = { id: null, name: "", cct: "" };
        selectedSchoolId = null;

        if (typeof window !== "undefined") {
          localStorage.removeItem("student_profile");
        }
      }
    } catch (err) {
      handleError(err, "obtener perfil de estudiante");
      hasStudentProfile = false;
      schoolInfo = { id: null, name: "", cct: "" };
      selectedSchoolId = null;
    } finally {
      isLoading = false;
    }
  }

  // Función para generar código de estudiante
  function generateStudentCode(userName, userId) {
    if (!userName || !userId) return null;

    // Tomar las primeras 3 letras del nombre (solo letras, sin espacios)
    const namePrefix = userName
      .replace(/[^a-zA-Z]/g, "") // Solo letras
      .substring(0, 3)
      .toUpperCase();

    return `${namePrefix}_${userId}`;
  }
  async function onUpdateSchoolInfo() {
    if (!token) return;

    // Asegurar que tenemos la info del usuario
    if (!currentUser) {
      await fetchCurrentUser();
      if (!currentUser) {
        error =
          "No se pudo obtener la información del usuario. Por favor, inicia sesión nuevamente.";
        return;
      }
    }

    // Si no hay selectedSchoolId pero hay CCT, hacer una última búsqueda
    if (selectedSchoolId === null && schoolInfo.cct && schoolInfo.cct.trim()) {
      try {
        error = null;
        isUpdatingSchool = true;

        const data = await makeRequest(
          `${apiBaseUrl}/schools/search-cct?cct=${encodeURIComponent(schoolInfo.cct.trim())}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const schools = data.success ? data.schools || [] : [];

        if (schools.length === 1) {
          // Auto-seleccionar la única escuela encontrada
          selectSuggestion(schools[0]);
          selectedSchoolId = schools[0].id;
        } else if (schools.length === 0) {
          error = "No se encontró ninguna escuela con ese CCT.";
          isUpdatingSchool = false;
          return;
        } else {
          error =
            "Se encontraron múltiples escuelas. Por favor, selecciona una de la lista.";
          schoolSuggestions = schools;
          isUpdatingSchool = false;
          return;
        }
      } catch (err) {
        handleError(err, "buscar escuela");
        isUpdatingSchool = false;
        return;
      }
    }

    if (selectedSchoolId === null) {
      error = "Por favor, selecciona una escuela antes de continuar.";
      return;
    }

    try {
      error = null;
      isUpdatingSchool = true;

      const url = `${apiBaseUrl}/student/profile`;
      const method = hasStudentProfile ? "PUT" : "POST";

      // Generar código de estudiante
      const studentCode = generateStudentCode(
        currentUser?.name,
        currentUser?.id,
      );

      if (!studentCode) {
        error =
          "No se pudo generar el código de estudiante. Verifica tu información de usuario.";
        return;
      }

      // Enviar los campos que necesita la API
      const body = {
        school_id: selectedSchoolId,
        code: studentCode,
      };

      console.log("Sending data to create/update profile:", body); // Debug log
      console.log("Generated student code:", studentCode); // Debug log
      console.log("User name:", currentUser?.name); // Debug log
      console.log("User ID:", currentUser?.id); // Debug log

      const data = await makeRequest(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      if (data.success) {
        hasStudentProfile = true;
        schoolInfo = {
          studentId: data.data.id || null,
          id: data.data.school?.id || schoolInfo.id,
          name: data.data.school?.name || schoolInfo.name,
          cct: data.data.school?.cct || schoolInfo.cct,
        };
        selectedSchoolId = schoolInfo.id;
        originalSchoolInfo = { ...schoolInfo };
        isEditingSchool = false;
        schoolSuggestions = [];

        // Guardar en localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "student_profile",
            JSON.stringify({
              schoolInfo,
              hasStudentProfile,
            }),
          );
        }
      } else {
        error = data.message || "Error al actualizar perfil";
      }
    } catch (err) {
      handleError(err, "actualizar perfil");
    } finally {
      isUpdatingSchool = false;
    }
  }

  // Toggle de edición con backup de datos
  function onToggleEdit() {
    if (!isEditingSchool) {
      // Entrando en modo edición
      originalSchoolInfo = { ...schoolInfo };
      selectedSchoolId = schoolInfo.id;
    } else {
      // Cancelando edición - restaurar datos originales
      schoolInfo = { ...originalSchoolInfo };
      selectedSchoolId = originalSchoolInfo.id;
      schoolSuggestions = [];
      error = null;
    }
    isEditingSchool = !isEditingSchool;
  }

  // Buscar escuelas con validación y manejo de errores
  const searchSchools = debounce(async () => {
    const cctValue = sanitizeInput(schoolInfo.cct);

    if (!cctValue) {
      schoolSuggestions = [];
      schoolInfo.name = "";
      selectedSchoolId = null;
      return;
    }

    if (!isValidCCT(cctValue)) {
      schoolSuggestions = [];
      schoolInfo.name = "";
      selectedSchoolId = null;
      return;
    }

    try {
      error = null;
      isSearching = true;

      const data = await makeRequest(
        `${apiBaseUrl}/schools/search-cct?cct=${encodeURIComponent(cctValue)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      schoolSuggestions = data.success ? data.schools || [] : [];

      if (schoolSuggestions.length === 1) {
        // Solo autocompletar si el CCT coincide exactamente
        const school = schoolSuggestions[0];
        if (school.cct === cctValue) {
          selectSuggestion(school);
        }
      } else if (schoolSuggestions.length === 0) {
        schoolInfo.name = "";
        selectedSchoolId = null;
        error = "No se encontraron escuelas con ese CCT.";
      } else {
        schoolInfo.name = "";
        selectedSchoolId = null; // Usar null en lugar de undefined
      }
    } catch (err) {
      handleError(err, "buscar escuelas");
      schoolSuggestions = [];
      schoolInfo.name = "";
      selectedSchoolId = null;
    } finally {
      isSearching = false;
    }
  }, 300);

  // Seleccionar sugerencia
  function selectSuggestion(school) {
    if (!school) return;

    schoolInfo = {
      id: school.id,
      name: school.name,
      cct: school.cct,
    };
    selectedSchoolId = school.id; // Esto puede ser 0, que es válido
    schoolSuggestions = [];
    error = null; // Limpiar cualquier error al seleccionar
  }

  // Manejo de teclado para accesibilidad
  function handleKeydown(event, school) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectSuggestion(school);
    }
  }

  // Limpiar error cuando se corrige
  function clearError() {
    error = null;
  }

  // Manejo de input CCT
  function handleCCTInput(event) {
    clearError();
    schoolInfo.cct = sanitizeInput(event.target.value);
    searchSchools();
  }

  // Manejo de blur en input CCT
  function handleCCTBlur() {
    setTimeout(() => {
      // Solo mostrar error si no hay escuela seleccionada Y no hay sugerencias Y hay texto en CCT
      if (
        selectedSchoolId === null &&
        schoolSuggestions.length === 0 &&
        schoolInfo.cct &&
        schoolInfo.cct.trim() !== ""
      ) {
        error =
          "No se encontraron escuelas con ese CCT. Verifica que esté correcto.";
      } else if (selectedSchoolId === null && schoolSuggestions.length === 1) {
        // Auto-seleccionar si solo hay una sugerencia
        selectSuggestion(schoolSuggestions[0]);
      }
    }, 300); // Aumentado el delay para permitir clicks en sugerencias
  }

  // Lifecycle
  onMount(() => {
    // Solo acceder a localStorage en el cliente
    if (typeof window !== "undefined") {
      // Recuperar token y currentUser
      token = localStorage.getItem("auth_token") || "";
      const savedUser = localStorage.getItem("current_user");
      if (savedUser) {
        try {
          currentUser = JSON.parse(savedUser);
        } catch (e) {
          console.error("Error parsing saved user:", e);
        }
      }

      // Recuperar perfil de estudiante
      const savedProfile = localStorage.getItem("student_profile");
      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile);
          schoolInfo = parsedProfile.schoolInfo || schoolInfo;
          hasStudentProfile = parsedProfile.hasStudentProfile || false;
          selectedSchoolId = schoolInfo.id;
        } catch (e) {
          console.error("Error parsing saved student profile:", e);
        }
      } else if (token) {
        fetchStudentProfile();
      }
    }
  });

  onDestroy(() => {
    if (abortController) abortController.abort();
    if (debounceTimeout) clearTimeout(debounceTimeout);
  });
</script>

<div class="school-card">
  <div class="card-header">
    <h2>Información de la Escuela</h2>
    <button
      class="edit-btn"
      on:click={onToggleEdit}
      disabled={isLoading || isUpdatingSchool}
    >
      {isEditingSchool
        ? "Cancelar"
        : hasStudentProfile
          ? "Editar Escuela"
          : "Agregar Escuela"}
    </button>
  </div>

  <!-- Indicador de carga global -->
  {#if isLoading}
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Cargando información...</p>
    </div>
  {:else if error}
    <div class="error-message" role="alert">
      <svg class="error-icon" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM13 17h-2v-2h2v2zm0-4h-2V7h2v6z"
        />
      </svg>
      {error}
      <button
        class="close-error"
        on:click={clearError}
        aria-label="Cerrar error">×</button
      >
    </div>
  {/if}

  {#if isEditingSchool}
    <form
      on:submit|preventDefault={onUpdateSchoolInfo}
      class="edit-school-form"
      novalidate
    >
      <div class="form-group">
        <label for="school-cct">
          CCT: <span class="required" aria-label="Campo obligatorio">*</span>
        </label>
        <div class="input-container">
          <input
            id="school-cct"
            type="text"
            bind:value={schoolInfo.cct}
            on:input={handleCCTInput}
            on:blur={handleCCTBlur}
            placeholder="Ej: 06DPR0123X"
            aria-describedby="cct-help"
            class:invalid={error && error.includes("CCT")}
            required
          />
          {#if isSearching}
            <div class="input-spinner"></div>
          {/if}
        </div>
        <small id="cct-help" class="help-text">
          Ingresa la Clave de Centro de Trabajo de tu escuela
        </small>

        {#if schoolSuggestions.length > 0}
          <ul
            class="suggestions-list"
            role="listbox"
            aria-label="Escuelas encontradas"
          >
            {#each schoolSuggestions as school, index}
              <li
                role="option"
                tabindex="0"
                class="suggestion-item"
                on:click={() => selectSuggestion(school)}
                on:keydown={(e) => handleKeydown(e, school)}
                aria-selected={selectedSchoolId === school.id}
              >
                <strong>{school.cct}</strong> - {school.name}
              </li>
            {/each}
          </ul>
        {/if}
      </div>

      <div class="form-group">
        <label for="school-name">Nombre de la Escuela:</label>
        <input
          id="school-name"
          type="text"
          bind:value={schoolInfo.name}
          readonly
          placeholder="Selecciona un CCT para autocompletar"
          class="readonly-input"
        />
      </div>

      <div class="form-actions">
        <button
          type="submit"
          class="save-btn"
          disabled={isUpdatingSchool ||
            (selectedSchoolId === null && !schoolInfo.cct?.trim())}
          aria-describedby="save-help"
        >
          {#if isUpdatingSchool}
            <div class="button-spinner"></div>
            Guardando...
          {:else}
            {hasStudentProfile ? "Actualizar Escuela" : "Crear Perfil"}
          {/if}
        </button>
        <small id="save-help" class="help-text">
          {selectedSchoolId !== null
            ? "Listo para guardar"
            : schoolInfo.cct?.trim()
              ? "Se buscará la escuela automáticamente"
              : "Ingresa un CCT para continuar"}
        </small>
      </div>
    </form>
  {:else if hasStudentProfile}
    <div class="school-info">
      <div class="info-item">
        <label>Nombre de la Escuela:</label>
        <span>{schoolInfo.name || "No especificado"}</span>
      </div>
      <div class="info-item">
        <label>CCT:</label>
        <span class="cct-display">{schoolInfo.cct || "No especificado"}</span>
      </div>
    </div>
  {:else}
    <div class="empty-state">
      <svg class="empty-icon" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"
        />
      </svg>
      <p>No tienes un perfil de estudiante creado aún.</p>
      <p class="help-text">Haz clic en "Agregar Escuela" para comenzar.</p>
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
    max-width: 100%;
    position: relative;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .card-header h2 {
    margin: 0;
    color: #343a40;
    font-size: 1.5rem;
  }

  .edit-btn {
    background: #007bff;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    min-width: 120px;
  }

  .edit-btn:hover:not(:disabled) {
    background: #0056b3;
    transform: translateY(-1px);
  }

  .edit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  /* Estados de carga y error */
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    gap: 1rem;
    color: #495057;
  }

  .spinner,
  .input-spinner,
  .button-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid #f3f3f3;
    border-top: 2px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .input-spinner {
    width: 16px;
    height: 16px;
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
  }

  .button-spinner {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .error-message {
    background: #fff3cd;
    color: #856404;
    padding: 1rem;
    border-radius: 6px;
    border: 1px solid #ffeaa7;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
  }

  .error-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    color: #ffc107;
  }

  .close-error {
    position: absolute;
    right: 10px;
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: #856404;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s;
  }

  .close-error:hover {
    background-color: rgba(255, 193, 7, 0.1);
    border-radius: 50%;
  }

  /* Información de la escuela */
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
    font-family: "Courier New", Courier, monospace;
    background-color: #f1f3f5;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-size: 0.9rem;
  }

  /* Formulario */
  .edit-school-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    position: relative;
  }

  .form-group label {
    font-weight: 600;
    color: #495057;
  }

  .required {
    color: #ffc107;
  }

  .input-container {
    position: relative;
  }

  .form-group input {
    padding: 0.75rem;
    border: 2px solid #e9ecef;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    width: 100%;
    box-sizing: border-box;
  }

  .form-group input:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  .form-group input.invalid {
    border-color: #ffc107;
  }

  .readonly-input {
    background-color: #f8f9fa;
    color: #6c757d;
  }

  .help-text {
    font-size: 0.85rem;
    color: #6c757d;
    margin: 0;
  }

  /* Lista de sugerencias */
  .suggestions-list {
    border: 1px solid #ddd;
    border-radius: 6px;
    margin-top: 0.25rem;
    max-height: 200px;
    overflow-y: auto;
    background: white;
    list-style: none;
    padding: 0;
    position: absolute;
    width: 100%;
    z-index: 10;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .suggestion-item {
    padding: 0.75rem;
    cursor: pointer;
    border-bottom: 1px solid #f8f9fa;
    transition: background-color 0.2s ease;
  }

  .suggestion-item:hover,
  .suggestion-item:focus {
    background-color: #f1f3f5;
    outline: 2px solid #007bff;
    outline-offset: -2px;
  }

  .suggestion-item[aria-selected="true"] {
    background-color: #e7f3ff;
  }

  .suggestion-item:last-child {
    border-bottom: none;
  }

  /* Acciones del formulario */
  .form-actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .save-btn {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 0.75rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 48px;
  }

  .save-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .save-btn:hover:not(:disabled) {
    background-color: #218838;
    transform: translateY(-1px);
  }

  /* Estado vacío */
  .empty-state {
    text-align: center;
    padding: 2rem;
    color: #6c757d;
  }

  .empty-icon {
    width: 64px;
    height: 64px;
    margin-bottom: 1rem;
    opacity: 0.5;
    color: #007bff;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .school-card {
      padding: 1rem;
    }

    .card-header {
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
    }

    .info-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.25rem;
    }

    .suggestions-list {
      max-height: 150px;
    }
  }

  /* Modo de alto contraste */
  @media (prefers-contrast: high) {
    .school-card {
      border: 2px solid #000;
    }

    .form-group input {
      border: 2px solid #000;
    }
  }
</style>
