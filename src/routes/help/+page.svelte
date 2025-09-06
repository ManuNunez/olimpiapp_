<script>
    // No script needed for static card
</script>

<style>
    /* Assuming app.css defines these variables, otherwise adjust as needed */
    :root {
        --primary: #2d6cdf;
        --secondary: #f5f7fa;
        --accent: #f9a826;
        --text: #222;
        --card-bg: #fff;
        --card-shadow: 0 2px 8px rgba(45, 108, 223, 0.08);
    }

    .card {
        background: var(--card-bg, #fff);
        color: var(--text, #222);
        border-radius: 1rem;
        box-shadow: var(--card-shadow, 0 2px 8px rgba(45, 108, 223, 0.08));
        padding: 2rem;
        max-width: 400px;
        margin: 2rem auto;
        border-left: 6px solid var(--primary, #2d6cdf);
        font-family: system-ui, sans-serif;
    }

    .card-title {
        font-size: 1.25rem;
        font-weight: bold;
        color: var(--primary, #2d6cdf);
        margin-bottom: 1rem;
    }

    .card-content {
        margin-bottom: 1rem;
        line-height: 1.5;
    }

    .card-email {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--accent, #f9a826);
        font-weight: 500;
        word-break: break-all;
    }

    .card-email svg {
        width: 1em;
        height: 1em;
        vertical-align: middle;
    }
</style>

<div class="card">
    <div class="card-title">Contacto</div>
    <div class="card-content">
        Manuel Nuñez, director del equipo de desarrollo y miembro del comité organizador
    </div>
    <div class="card-email">
        <svg viewBox="0 0 24 24" fill="none">
            <path d="M4 4h16v16H4V4zm8 8l8-8H4l8 8zm0 2l-8 8h16l-8-8z" fill="currentColor"/>
        </svg>
        correo: niuweme.nunez@gmail.com
    </div>
</div>