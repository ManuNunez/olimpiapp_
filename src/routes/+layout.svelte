<script>
	import Header from './Header.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<div class="app">
	<Header />

	<main>
		{@render children()}
	</main>

	<footer>
		<div class="footer-content">
			<div class="footer-section">
				<h4>OlimpiApp</h4>
				<p>Plataforma para la gestión de olimpiadas académicas</p>
			</div>
			<div class="footer-section">
				<h4>Enlaces</h4>
				<ul>
					<li><a href="/">Inicio</a></li>
					<li><a href="/about">Acerca de</a></li>
					<li><a href="/contact">Contacto</a></li>
				</ul>
			</div>
			<div class="footer-section">
				<h4>Soporte</h4>
				<ul>
					<li><a href="/help">Ayuda</a></li>
					<li><a href="/privacy">Privacidad</a></li>
					<li><a href="/terms">Términos</a></li>
				</ul>
			</div>
		</div>
		<div class="footer-bottom">
			<p>&copy; 2024 OlimpiApp. Todos los derechos reservados.</p>
		</div>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		background: var(--color-charcoal);
		color: var(--color-surface);
		padding: 2rem 0 1rem 0;
		margin-top: auto;
	}

	.footer-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 2rem;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 2rem;
	}

	.footer-section h4 {
		color: var(--color-primary);
		margin-bottom: 1rem;
		font-size: 1.1rem;
	}

	.footer-section p {
		color: var(--color-light-gray);
		line-height: 1.6;
	}

	.footer-section ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.footer-section li {
		margin-bottom: 0.5rem;
	}

	.footer-section a {
		color: var(--color-light-gray);
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.footer-section a:hover {
		color: var(--color-primary);
	}

	.footer-bottom {
		border-top: 1px solid var(--color-medium-gray);
		margin-top: 2rem;
		padding: 1rem 2rem 0 2rem;
		text-align: center;
		color: var(--color-light-gray);
	}

	@media (max-width: 768px) {
		.footer-content {
			grid-template-columns: 1fr;
			padding: 0 1rem;
			gap: 1.5rem;
		}
		
		.footer-bottom {
			padding: 1rem 1rem 0 1rem;
		}
	}
</style>
