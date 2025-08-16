<script>
	import { post } from '$lib/api.js';
	import { goto } from '$app/navigation';
	
	let formData = {
		full_name: '',
		username: '',
		email: '',
		password: '',
		password_confirmation: '',
		date_of_birth: '',
		curp: '',
		role_id: 2 // Estudiante por defecto
	};
	
	let isLoading = false;
	let error = '';
	let success = false;
	
	async function handleSignup(event) {
		event.preventDefault();
		isLoading = true;
		error = '';
		
		// Validar que las contraseñas coincidan
		if (formData.password !== formData.password_confirmation) {
			error = 'Las contraseñas no coinciden';
			isLoading = false;
			return;
		}
		
		try {
			const response = await post('http://127.0.0.1:8000/api/register', formData);
			
			if (response.access_token) {
				success = true;
				setTimeout(() => {
					goto('/login');
				}, 2000);
			}
		} catch (err) {
			if (err.response?.data?.message) {
				error = err.response.data.message;
			} else {
				error = err.message || 'Error al registrar usuario';
			}
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Registro - OlimpiApp</title>
</svelte:head>

<div class="auth-container">
	<div class="auth-card">
		<h1>Crear Cuenta</h1>
		
		{#if success}
			<div class="success">
				¡Registro exitoso! Redirigiendo al login...
			</div>
		{:else}
			<form on:submit={handleSignup}>
				<div class="form-group">
					<label for="full_name">Nombre completo</label>
					<input 
						type="text" 
						id="full_name" 
						bind:value={formData.full_name} 
						required 
						placeholder="Tu nombre completo"
						disabled={isLoading}
					/>
				</div>

				<div class="form-group">
					<label for="username">Nombre de usuario</label>
					<input 
						type="text" 
						id="username" 
						bind:value={formData.username} 
						required 
						placeholder="Tu usuario"
						disabled={isLoading}
					/>
				</div>
				
				<div class="form-group">
					<label for="email">Email</label>
					<input 
						type="email" 
						id="email" 
						bind:value={formData.email} 
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
						bind:value={formData.password} 
						required 
						placeholder="••••••••"
						disabled={isLoading}
						minlength="8"
					/>
				</div>
				
				<div class="form-group">
					<label for="password_confirmation">Confirmar contraseña</label>
					<input 
						type="password" 
						id="password_confirmation" 
						bind:value={formData.password_confirmation} 
						required 
						placeholder="••••••••"
						disabled={isLoading}
						minlength="8"
					/>
				</div>

				<div class="form-group">
					<label for="date_of_birth">Fecha de nacimiento</label>
					<input 
						type="date" 
						id="date_of_birth" 
						bind:value={formData.date_of_birth}
						disabled={isLoading}
					/>
				</div>

				<div class="form-group">
					<label for="curp">CURP</label>
					<input 
						type="text" 
						id="curp" 
						bind:value={formData.curp}
						disabled={isLoading}
						placeholder="Opcional"
					/>
				</div>

				<div class="form-group">
					<label for="role_id">Rol</label>
					<select id="role_id" bind:value={formData.role_id} disabled={isLoading}>
						<option value="1">Maestro</option>
						<option value="2">Estudiante</option>
						<option value="3">Padre</option>
					</select>
				</div>
				
				{#if error}
					<div class="error">{error}</div>
				{/if}
				
				<button type="submit" disabled={isLoading} class="btn-primary">
					{#if isLoading}
						Creando cuenta...
					{:else}
						Crear Cuenta
					{/if}
				</button>
			</form>
		{/if}
		
		<div class="auth-links">
			<a href="/login">¿Ya tienes cuenta? Inicia sesión</a>
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
	
	input, select {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
		transition: border-color 0.3s;
	}
	
	input:focus, select:focus {
		outline: none;
		border-color: #BD2A2E; /* rojo para focus */
		box-shadow: 0 0 0 2px rgba(189, 42, 46, 0.2);
	}
	
	input:disabled, select:disabled {
		background-color: #f8f9fa;
		cursor: not-allowed;
	}
	
	.btn-primary {
		width: 100%;
		padding: 0.75rem;
		background: #BD2A2E; /* rojo para botones */
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
		transition: background-color 0.3s;
	}
	
	.btn-primary:hover:not(:disabled) {
		background: #8c1f24; /* versión más oscura para hover */
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
	
	.success {
		color: #155724;
		margin-bottom: 1rem;
		padding: 0.5rem;
		background: #d4edda;
		border-radius: 4px;
		border: 1px solid #c3e6cb;
		text-align: center;
	}
	
	.auth-links {
		text-align: center;
		margin-top: 1.5rem;
	}
	
	.auth-links a {
		display: block;
		margin-bottom: 0.5rem;
		color: #BD2A2E; /* rojo para enlaces */
		text-decoration: none;
	}
	
	.auth-links a:hover {
		text-decoration: underline;
	}
</style>
