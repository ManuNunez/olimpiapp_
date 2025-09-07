import * as universal from '../entries/pages/_page.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.js";
export const imports = ["_app/immutable/nodes/2.BpUArf-H.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BUd4d-LD.js","_app/immutable/chunks/CrvXbrvd.js","_app/immutable/chunks/B-D_S5cw.js"];
export const stylesheets = ["_app/immutable/assets/2.pQ2qMPm2.css"];
export const fonts = [];
