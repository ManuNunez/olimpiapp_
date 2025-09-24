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
		client: {start:"_app/immutable/entry/start.6kvb5hlR.js",app:"_app/immutable/entry/app.CHmx7V6J.js",imports:["_app/immutable/entry/start.6kvb5hlR.js","_app/immutable/chunks/DtpdRmet.js","_app/immutable/chunks/4ewAZS7k.js","_app/immutable/chunks/7EcpVrG4.js","_app/immutable/chunks/DZQzIwON.js","_app/immutable/chunks/C_dj29aV.js","_app/immutable/entry/app.CHmx7V6J.js","_app/immutable/chunks/7EcpVrG4.js","_app/immutable/chunks/DZQzIwON.js","_app/immutable/chunks/C_dj29aV.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/4ewAZS7k.js","_app/immutable/chunks/CVepnse1.js","_app/immutable/chunks/3Pkr_vQ4.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js'))
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
				id: "/contests",
				pattern: /^\/contests\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/help",
				pattern: /^\/help\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/signup",
				pattern: /^\/signup\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
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
