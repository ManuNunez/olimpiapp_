import { y as head, z as bind_props } from "../../chunks/index.js";
import { e as escape_html } from "../../chunks/escaping.js";
function _error($$payload, $$props) {
  let error = $$props["error"];
  let status = $$props["status"];
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>${escape_html(status ?? "404")} - Plataforma en desarrollo</title>`;
  });
  $$payload.out += `<main class="error-page svelte-1ysxsen"><h1 class="svelte-1ysxsen">${escape_html(status ?? "404")}</h1> <h2 class="svelte-1ysxsen">Plataforma en desarrollo</h2> <p class="svelte-1ysxsen">Esta plataforma aún está en desarrollo. Te invitamos a estar pendiente de las redes sociales de la olimpiada para que seas notificado de las actualizaciones.</p> <a href="/" class="btn svelte-1ysxsen">Volver al inicio</a></main>`;
  bind_props($$props, { error, status });
}
export {
  _error as default
};
