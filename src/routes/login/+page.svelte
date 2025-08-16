<script>
	import { auth } from '$lib/api.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	
	let email = '';
	let password = '';
	let isLoading = false;
	let error = '';
	
	async function handleLogin(event) {
		event.preventDefault();
		isLoading = true;
		error = '';
		
		try {
			const response = await auth.login({ email, password });
			
			if (response.token) {
				// Redirigir al usuario a la página desde la que vino o al dashboard
				const returnUrl = $page.url.searchParams.get('returnUrl') || '/dashboard';
				goto(returnUrl);
			}
		} catch (err) {
			error = err.message || 'Error al iniciar sesión';
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Iniciar Sesión - OlimpiApp</title>
</svelte:head>

<div class="auth-container">
	<div class="auth-card">
		<h1>Iniciar Sesión</h1>
		
		<form on:submit={handleLogin}>
			<div class="form-group">
				<label for="email">Email</label>
				<input 
					type="email" 
					id="email" 
					bind:value={email} 
					required 
					placeholder="ejemplo@email.com"
					disabled={isLoading}
				/>
			</div>
			
			<div class="form-group">
				<label for="password">Contraseña</label>
				<input 
					type="password" 
					id="password" 
					bind:value={password} 
					required 
					placeholder="••••••••"
					disabled={isLoading}
				/>
			</div>
			
			{#if error}
				<div class="error">{error}</div>
			{/if}
			
			<button type="submit" disabled={isLoading} class="btn-primary">
				{#if isLoading}
					Iniciando sesión...
				{:else}
					Iniciar Sesión
				{/if}
			</button>
		</form>
		
		<div class="auth-links">
			<a href="/signup">¿No tienes cuenta? Regístrate</a>
			<a href="/forgot-password">¿Olvidaste tu contraseña?</a>
		</div>
	</div>
</div>

<style>
	.auth-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 80vh;
		padding: 1rem;
	}
	
	.auth-card {
		background: white;
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		width: 100%;
		max-width: 400px;
	}
	
	h1 {
		text-align: center;
		margin-bottom: 1.5rem;
		color: #333;
	}
	
	.form-group {
		margin-bottom: 1rem;
	}
	
	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		color: #555;
	}
	
	input {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
		transition: border-color 0.3s;
	}
	
	input:focus {
		outline: none;
		border-color: #007bff;
	}
	
	input:disabled {
		background-color: #f8f9fa;
		cursor: not-allowed;
	}
	
	.btn-primary {
		width: 100%;
		padding: 0.75rem;
		background: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
		transition: background-color 0.3s;
	}
	
	.btn-primary:hover:not(:disabled) {
		background: #0056b3;
	}
	
	.btn-primary:disabled {
		background: #6c757d;
		cursor: not-allowed;
	}
	
	.error {
		color: #dc3545;
		margin-bottom: 1rem;
		padding: 0.5rem;
		background: #f8d7da;
		border-radius: 4px;
		border: 1px solid #f5c6cb;
	}
	
	.auth-links {
		text-align: center;
		margin-top: 1.5rem;
	}
	
	.auth-links a {
		display: block;
		margin-bottom: 0.5rem;
		color: #007bff;
		text-decoration: none;
	}
	
	.auth-links a:hover {
		text-decoration: underline;
	}
</style>
