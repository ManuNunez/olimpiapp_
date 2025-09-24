import { y as head, w as pop, u as push } from "../../../chunks/index.js";
import "../../../chunks/client.js";
function _page($$payload, $$props) {
  push();
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Mi Cuenta - OlimpiApp</title>`;
  });
  $$payload.out += `<div class="account-container svelte-101e3si"><div class="account-header svelte-101e3si"><h1 class="svelte-101e3si">Mi Cuenta</h1> <button class="logout-btn svelte-101e3si">Cerrar Sesión</button></div> `;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="loading-container svelte-101e3si"><div class="loading-spinner svelte-101e3si"></div> <p class="svelte-101e3si">Cargando información del usuario...</p></div>`;
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
export {
  _page as default
};
