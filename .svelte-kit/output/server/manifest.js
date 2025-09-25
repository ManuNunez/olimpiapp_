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
		client: {start:"_app/immutable/entry/start.U_itQvdF.js",app:"_app/immutable/entry/app.0YhiBfvv.js",imports:["_app/immutable/entry/start.U_itQvdF.js","_app/immutable/chunks/2vYq94do.js","_app/immutable/chunks/B1IU5tNg.js","_app/immutable/chunks/C901yvH2.js","_app/immutable/chunks/CDXfdr7Z.js","_app/immutable/chunks/z-uT40pH.js","_app/immutable/entry/app.0YhiBfvv.js","_app/immutable/chunks/C901yvH2.js","_app/immutable/chunks/CDXfdr7Z.js","_app/immutable/chunks/z-uT40pH.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/B1IU5tNg.js","_app/immutable/chunks/By4PCX_d.js","_app/immutable/chunks/9Uc4HryN.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
