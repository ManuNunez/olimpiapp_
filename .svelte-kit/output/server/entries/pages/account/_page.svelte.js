import { y as head, w as pop, u as push } from "../../../chunks/index.js";
import "../../../chunks/client.js";
function _page($$payload, $$props) {
  push();
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Mi Cuenta - OlimpiApp</title>`;
  });
  $$payload.out += `<div class="account-container svelte-d6bq0g"><div class="account-header svelte-d6bq0g"><h1 class="svelte-d6bq0g">Mi Cuenta</h1> <button class="logout-btn svelte-d6bq0g">Cerrar Sesión</button></div> `;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="loading-container svelte-d6bq0g"><div class="loading-spinner svelte-d6bq0g"></div> <p class="svelte-d6bq0g">Cargando información del usuario...</p></div>`;
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
export {
  _page as default
};
