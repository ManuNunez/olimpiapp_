
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```bash
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const TMUX: string;
	export const USER: string;
	export const npm_config_user_agent: string;
	export const XDG_SEAT: string;
	export const XDG_SESSION_TYPE: string;
	export const npm_node_execpath: string;
	export const SHLVL: string;
	export const npm_config_noproxy: string;
	export const HOME: string;
	export const LESS: string;
	export const OLDPWD: string;
	export const DESKTOP_SESSION: string;
	export const TERM_PROGRAM_VERSION: string;
	export const npm_package_json: string;
	export const LSCOLORS: string;
	export const ZSH: string;
	export const GTK_MODULES: string;
	export const PAGER: string;
	export const npm_config_userconfig: string;
	export const npm_config_local_prefix: string;
	export const DBUS_SESSION_BUS_ADDRESS: string;
	export const P9K_TTY: string;
	export const COLORTERM: string;
	export const COLOR: string;
	export const npm_config_metrics_registry: string;
	export const ALACRITTY_SOCKET: string;
	export const GTK_IM_MODULE: string;
	export const LOGNAME: string;
	export const WINDOWID: string;
	export const _: string;
	export const _P9K_SSH_TTY: string;
	export const npm_config_prefix: string;
	export const XDG_SESSION_CLASS: string;
	export const ALACRITTY_LOG: string;
	export const TERM: string;
	export const USERNAME: string;
	export const XDG_SESSION_ID: string;
	export const npm_config_cache: string;
	export const WINDOWPATH: string;
	export const npm_config_node_gyp: string;
	export const PATH: string;
	export const GDM_LANG: string;
	export const NODE: string;
	export const npm_package_name: string;
	export const XDG_RUNTIME_DIR: string;
	export const DISPLAY: string;
	export const LANG: string;
	export const XDG_CURRENT_DESKTOP: string;
	export const LS_COLORS: string;
	export const TERM_PROGRAM: string;
	export const XAUTHORITY: string;
	export const XDG_SESSION_DESKTOP: string;
	export const XMODIFIERS: string;
	export const npm_lifecycle_script: string;
	export const SSH_AUTH_SOCK: string;
	export const SHELL: string;
	export const npm_package_version: string;
	export const npm_lifecycle_event: string;
	export const GDMSESSION: string;
	export const QT_ACCESSIBILITY: string;
	export const GPG_AGENT_INFO: string;
	export const P9K_SSH: string;
	export const ALACRITTY_WINDOW_ID: string;
	export const QT_IM_MODULE: string;
	export const XDG_VTNR: string;
	export const npm_config_globalconfig: string;
	export const npm_config_init_module: string;
	export const PWD: string;
	export const npm_config_globalignorefile: string;
	export const npm_execpath: string;
	export const CLUTTER_IM_MODULE: string;
	export const XDG_DATA_DIRS: string;
	export const _P9K_TTY: string;
	export const npm_config_global_prefix: string;
	export const npm_command: string;
	export const I3SOCK: string;
	export const TMUX_PANE: string;
	export const INIT_CWD: string;
	export const EDITOR: string;
	export const NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		TMUX: string;
		USER: string;
		npm_config_user_agent: string;
		XDG_SEAT: string;
		XDG_SESSION_TYPE: string;
		npm_node_execpath: string;
		SHLVL: string;
		npm_config_noproxy: string;
		HOME: string;
		LESS: string;
		OLDPWD: string;
		DESKTOP_SESSION: string;
		TERM_PROGRAM_VERSION: string;
		npm_package_json: string;
		LSCOLORS: string;
		ZSH: string;
		GTK_MODULES: string;
		PAGER: string;
		npm_config_userconfig: string;
		npm_config_local_prefix: string;
		DBUS_SESSION_BUS_ADDRESS: string;
		P9K_TTY: string;
		COLORTERM: string;
		COLOR: string;
		npm_config_metrics_registry: string;
		ALACRITTY_SOCKET: string;
		GTK_IM_MODULE: string;
		LOGNAME: string;
		WINDOWID: string;
		_: string;
		_P9K_SSH_TTY: string;
		npm_config_prefix: string;
		XDG_SESSION_CLASS: string;
		ALACRITTY_LOG: string;
		TERM: string;
		USERNAME: string;
		XDG_SESSION_ID: string;
		npm_config_cache: string;
		WINDOWPATH: string;
		npm_config_node_gyp: string;
		PATH: string;
		GDM_LANG: string;
		NODE: string;
		npm_package_name: string;
		XDG_RUNTIME_DIR: string;
		DISPLAY: string;
		LANG: string;
		XDG_CURRENT_DESKTOP: string;
		LS_COLORS: string;
		TERM_PROGRAM: string;
		XAUTHORITY: string;
		XDG_SESSION_DESKTOP: string;
		XMODIFIERS: string;
		npm_lifecycle_script: string;
		SSH_AUTH_SOCK: string;
		SHELL: string;
		npm_package_version: string;
		npm_lifecycle_event: string;
		GDMSESSION: string;
		QT_ACCESSIBILITY: string;
		GPG_AGENT_INFO: string;
		P9K_SSH: string;
		ALACRITTY_WINDOW_ID: string;
		QT_IM_MODULE: string;
		XDG_VTNR: string;
		npm_config_globalconfig: string;
		npm_config_init_module: string;
		PWD: string;
		npm_config_globalignorefile: string;
		npm_execpath: string;
		CLUTTER_IM_MODULE: string;
		XDG_DATA_DIRS: string;
		_P9K_TTY: string;
		npm_config_global_prefix: string;
		npm_command: string;
		I3SOCK: string;
		TMUX_PANE: string;
		INIT_CWD: string;
		EDITOR: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
