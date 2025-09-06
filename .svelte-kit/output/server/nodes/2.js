import * as universal from '../entries/pages/_page.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.js";
export const imports = ["_app/immutable/nodes/2.CMtntDP8.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BGmNO-Kf.js","_app/immutable/chunks/C2U4IKIp.js","_app/immutable/chunks/BjGg-ub7.js"];
export const stylesheets = ["_app/immutable/assets/2.pQ2qMPm2.css"];
export const fonts = [];
