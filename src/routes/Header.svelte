<script>
 import { page } from '$app/state';
 import { auth } from '$lib/api.js';
 import { onMount } from 'svelte';
 
 let isLoggedIn = false;
 let isStudent = false;
 let isLoadingRole = false;
 let user = null;

 onMount(() => {
   isLoggedIn = auth.isLoggedIn();
   
   // Si está logueado, verificar el rol
   if (isLoggedIn) {
     checkUserRole();
   }
   
   // Escuchar cambios en el storage para actualizar el estado
   const handleStorageChange = () => {
     const wasLoggedIn = isLoggedIn;
     isLoggedIn = auth.isLoggedIn();
     
     // Si cambió el estado de login, actualizar el rol
     if (wasLoggedIn !== isLoggedIn) {
       if (isLoggedIn) {
         checkUserRole();
       } else {
         // Si se deslogueó, resetear estados
         isStudent = false;
         user = null;
       }
     }
   };
   
   window.addEventListener('storage', handleStorageChange);
   
   return () => {
     window.removeEventListener('storage', handleStorageChange);
   };
 });

 async function checkUserRole() {
   try {
     isLoadingRole = true;
     
     // Obtener información del usuario
     user = await auth.me();
     
     if (user?.id) {
       // Verificar si tiene rol de estudiante
       const studentCheck = await auth.checkUserHasRole(user.id, auth.ROLES.STUDENT);
       isStudent = studentCheck.success && studentCheck.has_role;
     }
   } catch (error) {
     console.error('Error verificando rol del usuario:', error);
     isStudent = false;
   } finally {
     isLoadingRole = false;
   }
 }
</script>

<header>
  <div class="logo">
    <a href="/">
      <span class="logo-icon">🏆</span>
      <span class="logo-text">OlimpiApp</span>
    </a>
  </div>
  
  <nav>
    <ul>
      <li aria-current={page.url.pathname === '/' ? 'page' : undefined}>
        <a href="/">Inicio</a>
      </li>
      
      {#if isLoggedIn}
        {#if isStudent && !isLoadingRole}
          <li aria-current={page.url.pathname.startsWith('/contests') ? 'page' : undefined}>
            <a href="/contests">Competencias</a>
          </li>
        {/if}
        
        <!-- Puedes agregar más rutas para otros roles aquí -->
        <!-- {#if isTeacher}
          <li aria-current={page.url.pathname.startsWith('/teacher') ? 'page' : undefined}>
            <a href="/teacher/dashboard">Panel Maestro</a>
          </li>
        {/if} -->
        
      {:else}
        <li aria-current={page.url.pathname === '/login' ? 'page' : undefined}>
          <a href="/login">Iniciar Sesión</a>
        </li>
        <li aria-current={page.url.pathname === '/signup' ? 'page' : undefined}>
          <a href="/signup">Registrarse</a>
        </li>
      {/if}
    </ul>
  </nav>
  
  <div class="user-actions">
    {#if isLoggedIn}
      <div class="user-menu">
        {#if isLoadingRole}
          <div class="loading-indicator">
            <span class="loading-spinner"></span>
          </div>
        {/if}
        
        <a href="/account" class="user-link">
          <span class="user-icon">👤</span>
          {#if user?.name}
            <span class="user-name">{user.name}</span>
          {:else}
            <span>Perfil</span>
          {/if}
        </a>
        
        {#if isStudent}
          <span class="role-badge student">Estudiante</span>
        {/if}
      </div>
    {/if}
  </div>
</header>

<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: var(--color-surface);
    box-shadow: 0 2px 4px rgba(59, 57, 54, 0.15);
    border-bottom: 1px solid var(--color-border);
  }

  .logo {
    display: flex;
    align-items: center;
  }

  .logo a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: var(--color-text);
    font-weight: 700;
    font-size: 1.5rem;
    transition: color 0.2s ease;
  }

  .logo a:hover {
    color: var(--color-primary);
  }

  .logo-icon {
    font-size: 1.8rem;
  }

  .logo-text {
    color: var(--color-primary);
  }

  nav {
    display: flex;
    justify-content: center;
    flex: 1;
  }

  ul {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
    gap: 2rem;
  }

  li {
    position: relative;
  }

  li[aria-current='page']::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--color-primary);
    border-radius: 1px;
  }

  nav a {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    color: var(--color-text-secondary);
    font-weight: 500;
    font-size: 0.95rem;
    text-decoration: none;
    transition: all 0.2s ease;
    border-radius: 4px;
  }

  nav a:hover {
    color: var(--color-primary);
    background: rgba(178, 190, 191, 0.2);
  }

  .user-actions {
    display: flex;
    align-items: center;
  }

  .user-menu {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .loading-indicator {
    display: flex;
    align-items: center;
  }

  .loading-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid #f3f3f3;
    border-top: 2px solid var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .user-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    color: var(--color-text-secondary);
    font-weight: 500;
    text-decoration: none;
    border-radius: 4px;
    transition: all 0.2s ease;
  }

  .user-link:hover {
    color: var(--color-primary);
    background: rgba(178, 190, 191, 0.2);
  }

  .user-icon {
    font-size: 1.2rem;
  }

  .user-name {
    font-size: 0.9rem;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .role-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .role-badge.student {
    background: rgba(40, 167, 69, 0.1);
    color: #28a745;
    border: 1px solid rgba(40, 167, 69, 0.2);
  }

  /* Puedes agregar más estilos para otros roles */
  .role-badge.teacher {
    background: rgba(0, 123, 255, 0.1);
    color: #007bff;
    border: 1px solid rgba(0, 123, 255, 0.2);
  }

  .role-badge.admin {
    background: rgba(220, 53, 69, 0.1);
    color: #dc3545;
    border: 1px solid rgba(220, 53, 69, 0.2);
  }

  @media (max-width: 768px) {
    header {
      padding: 1rem;
    }

    ul {
      gap: 1rem;
    }

    nav a {
      padding: 0.5rem;
      font-size: 0.9rem;
    }

    .logo-text {
      display: none;
    }

    .user-name {
      display: none;
    }

    .role-badge {
      display: none;
    }

    .user-menu {
      gap: 0.5rem;
    }
  }

  @media (max-width: 480px) {
    header {
      padding: 0.75rem;
    }

    ul {
      gap: 0.5rem;
    }

    nav a {
      padding: 0.4rem 0.6rem;
      font-size: 0.85rem;
    }

    .user-link {
      padding: 0.4rem 0.6rem;
    }
  }
</style>