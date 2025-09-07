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
		client: {start:"_app/immutable/entry/start.CxXNdkBI.js",app:"_app/immutable/entry/app.DeC_0tG8.js",imports:["_app/immutable/entry/start.CxXNdkBI.js","_app/immutable/chunks/Dv3kE98R.js","_app/immutable/chunks/elrBWB1X.js","_app/immutable/chunks/CrvXbrvd.js","_app/immutable/chunks/Dcj7EJXu.js","_app/immutable/chunks/B-D_S5cw.js","_app/immutable/entry/app.DeC_0tG8.js","_app/immutable/chunks/CrvXbrvd.js","_app/immutable/chunks/Dcj7EJXu.js","_app/immutable/chunks/B-D_S5cw.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/elrBWB1X.js","_app/immutable/chunks/CuKpEqi_.js","_app/immutable/chunks/DTCiORo2.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/account",
				pattern: /^\/account\/?$/,
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
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
