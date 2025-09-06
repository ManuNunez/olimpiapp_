<script>
  export let error;
  export let status;
</script>

<svelte:head>
  <title>{status ?? '404'} - Plataforma en desarrollo</title>
</svelte:head>

<main class="error-page">
  <h1>{status ?? '404'}</h1>
  <h2>Plataforma en desarrollo</h2>
  <p>
    Esta plataforma aún está en desarrollo. Te invitamos a estar pendiente de las redes sociales de la olimpiada para que seas notificado de las actualizaciones.
  </p>
  <a href="/" class="btn">Volver al inicio</a>
</main>

<style>
  .error-page {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 80vh;
    padding: 1rem;
    font-family: sans-serif;
    background: #f0f4f8;
    color: #333;
  }

  h1 {
    font-size: 6rem;
    margin: 0;
    color: #ff6b6b;
  }

  h2 {
    font-size: 2rem;
    margin: 0.5rem 0 1rem 0;
  }

  p {
    font-size: 1.2rem;
    max-width: 600px;
  }

  .btn {
    margin-top: 2rem;
    padding: 0.75rem 1.5rem;
    background-color: #4f46e5;
    color: white;
    text-decoration: none;
    border-radius: 0.5rem;
    transition: background-color 0.3s;
  }

  .btn:hover {
    background-color: #3730a3;
  }
</style>
