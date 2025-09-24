

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/help/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.D0JLEgpB.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CSmps_KN.js","_app/immutable/chunks/7EcpVrG4.js"];
export const stylesheets = ["_app/immutable/assets/5.9lx2LgQ8.css"];
export const fonts = [];
