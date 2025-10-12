<script>
 // Página principal de OlimpiApp
</script>

<svelte:head>
<title>OlimpiApp - Gestión de Olimpiadas Académicas</title>
<meta name="description" content="Aplicación para gestionar olimpiadas académicas" />
</svelte:head>

<!-- OMRCh Announcement Section -->
<section class="omrch-announcement">
<h2>¡Inscripciones Abiertas!</h2>
<p>Las inscripciones para la <strong>XV edición de la OMRCh</strong> (Olimpiada de la Ribera de Chapala) ya están <strong>abiertas</strong>.
 No pierdas la oportunidad de participar en este gran evento. <strong>¡Regístrate antes del 2 de noviembre!</strong></p>
</section>

<style>
/* OMRCh Announcement Section con fondo transparente/gradiente */
.omrch-announcement {
 text-align: center;
 padding: 3rem 2rem;
 background: linear-gradient(135deg, var(--color-light-gray), var(--color-surface));
 border-bottom: 2px solid var(--color-border);
}

.omrch-announcement h2 {
 font-size: 2.5rem;
 color: var(--color-primary);
 margin-bottom: 1rem;
 font-weight: 700;
}

.omrch-announcement p {
 font-size: 1.25rem;
 color: var(--color-text-secondary);
 max-width: 700px;
 margin: 0 auto;
 line-height: 1.6;
}

/* Hero Section con fondo sólido gris */
.hero {
 display: flex;
 flex-direction: column;
 justify-content: center;
 align-items: center;
 text-align: center;
 padding: 4rem 2rem;
 min-height: 60vh;
 background-color: var(--color-light-gray);
}

.hero h1 {
 font-size: 3rem;
 color: var(--color-text);
 margin-bottom: 2rem;
 font-weight: 700;
}

.hero p {
 font-size: 1.25rem;
 color: var(--color-text-secondary);
 margin-bottom: 2rem;
 max-width: 600px;
}

.home-buttons {
 display: flex;
 gap: 1rem;
}

.btn {
 background-color: var(--color-primary);
 color: var(--color-surface);
 padding: 0.75rem 1.5rem;
 border-radius: 8px;
 text-decoration: none;
 transition: all 0.3s ease;
 border: 2px solid var(--color-primary);
 font-weight: 600;
}

.btn:hover {
 background-color: var(--color-hover);
 border-color: var(--color-hover);
 transform: translateY(-2px);
 box-shadow: 0 4px 12px rgba(59, 57, 54, 0.3);
}

.hero-list {
 display: grid;
 grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
 gap: 1rem;
 max-width: 1200px;
 margin: 0 auto;
}

.hero-card {
 background: var(--color-surface);
 border: 2px solid var(--color-border);
 border-radius: 12px;
 padding: 1rem;
 transition: all 0.3s ease;
 box-shadow: 0 4px 6px rgba(59, 57, 54, 0.1);
}

.hero-card:hover {
 border-color: var(--color-primary);
 transform: translateY(-4px);
 box-shadow: 0 8px 20px rgba(59, 57, 54, 0.15);
}

.hero-card h3 {
 color: var(--color-primary);
 margin-bottom: 1rem;
 font-size: 1.5rem;
 font-weight: 600;
}

.hero-card p {
 color: var(--color-text-secondary);
 line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
.omrch-announcement h2 {
 font-size: 2rem;
 }

.omrch-announcement p {
 font-size: 1rem;
 }

.hero h1 {
 font-size: 2rem;
 }

.hero p {
 font-size: 1rem;
 }

.home-buttons {
 flex-direction: column;
 width: 100%;
 max-width: 300px;
 }

.hero-list {
 grid-template-columns: 1fr;
 }
}
</style>