<script>
	let name = "";
	let username = "";
	let email = "";
	let password = "";
	let password_confirmation = "";
	let role_id = "2"; // valor por defecto estudiante

	let isLoading = false;
	let error = "";
	let success = "";

	async function handleSignup(e) {
		e.preventDefault();
		error = "";
		success = "";
		isLoading = true;

		try {
			const res = await fetch("http://localhost:8000/api/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({
					name,
					username,
					email,
					password,
					password_confirmation,
					role_id,
				}),
			});

			const data = await res.json();

			if (!res.ok) {
				error = data.message || "Error en el registro";
			} else {
				success = "Registro exitoso 🎉";
				localStorage.setItem("auth_token", data.access_token);
				localStorage.setItem("token_type", data.token_type); // normalmente "Bearer"
				localStorage.setItem("user", JSON.stringify(data.user));
				
				setTimeout(() => {
					window.location.href = "/";
				}, 1500);
				
			}
		} catch (err) {
			error = "No se pudo conectar con el servidor";
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="auth-container">
	<div class="auth-card">
		<h1>Crear cuenta</h1>

		<form on:submit={handleSignup}>
			<div class="form-group">
				<label for="name">Nombre completo</label>
				<input
					type="text"
					id="name"
					bind:value={name}
					required
					placeholder="Juan Pérez"
					disabled={isLoading}
				/>
			</div>

			<div class="form-group">
				<label for="username">Usuario</label>
				<input
					type="text"
					id="username"
					bind:value={username}
					required
					placeholder="juanperez123"
					disabled={isLoading}
				/>
			</div>

			<div class="form-group">
				<label for="email">Correo electrónico</label>
				<input
					type="email"
					id="email"
					bind:value={email}
					required
					placeholder="correo@ejemplo.com"
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

			<div class="form-group">
				<label for="password_confirmation">Confirmar contraseña</label>
				<input
					type="password"
					id="password_confirmation"
					bind:value={password_confirmation}
					required
					placeholder="••••••••"
					disabled={isLoading}
				/>
			</div>

			<div class="form-group">
				<label for="role_id">Rol</label>
				<select
					id="role_id"
					bind:value={role_id}
					disabled={isLoading}
					required
				>
					<option value="2">Estudiante</option>
					<option value="3">Maestro</option>
				</select>
			</div>

			{#if error}
				<div class="error">{error}</div>
			{/if}

			{#if success}
				<div class="success">{success}</div>
			{/if}

			<button type="submit" disabled={isLoading} class="btn-primary">
				{#if isLoading}
					Registrando...
				{:else}
					Registrarse
				{/if}
			</button>
		</form>

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
		color: var(--color-charcoal);
	}

	.form-group {
		margin-bottom: 1rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		color: var(--color-text-secondary);
	}

	input,
	select {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: 4px;
		font-size: 1rem;
		transition: border-color 0.3s;
	}

	input:focus,
	select:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 2px rgba(189, 42, 46, 0.2);
	}

	input:disabled,
	select:disabled {
		background-color: #f8f9fa;
		cursor: not-allowed;
	}

	.btn-primary {
		width: 100%;
		padding: 0.75rem;
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	.btn-primary:hover:not(:disabled) {
		background: #360f69;
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
		color: var(--color-primary);
		text-decoration: none;
	}

	.auth-links a:hover {
		text-decoration: underline;
	}
</style>
