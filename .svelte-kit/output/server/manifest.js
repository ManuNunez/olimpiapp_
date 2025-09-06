export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.svg","robots.txt"]),
	mimeTypes: {".svg":"image/svg+xml",".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.ns7AXpZC.js",app:"_app/immutable/entry/app.B11mOpml.js",imports:["_app/immutable/entry/start.ns7AXpZC.js","_app/immutable/chunks/BMpYDMX-.js","_app/immutable/chunks/CTLqXXGx.js","_app/immutable/chunks/C2U4IKIp.js","_app/immutable/chunks/B6thhSHX.js","_app/immutable/chunks/BjGg-ub7.js","_app/immutable/chunks/BHJNKnnR.js","_app/immutable/entry/app.B11mOpml.js","_app/immutable/chunks/C2U4IKIp.js","_app/immutable/chunks/B6thhSHX.js","_app/immutable/chunks/BjGg-ub7.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CTLqXXGx.js","_app/immutable/chunks/ly8UQ4rw.js","_app/immutable/chunks/3mfpV_cy.js","_app/immutable/chunks/BOcB0n1D.js","_app/immutable/chunks/BHJNKnnR.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js'))
		],
		routes: [
			{
				id: "/account",
				pattern: /^\/account\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/help",
				pattern: /^\/help\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/signup",
				pattern: /^\/signup\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			}
		],
		prerendered_routes: new Set(["/"]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
