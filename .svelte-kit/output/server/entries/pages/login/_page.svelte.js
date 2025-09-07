import { y as head, w as pop, u as push } from "../../../chunks/index.js";
import "../../../chunks/client.js";
import { a as attr } from "../../../chunks/attributes.js";
function _page($$payload, $$props) {
  push();
  let email = "";
  let password = "";
  let isLoading = false;
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Iniciar Sesión - OlimpiApp</title>`;
  });
  $$payload.out += `<div class="auth-container svelte-1gi6e0m"><div class="auth-card svelte-1gi6e0m"><h1 class="svelte-1gi6e0m">Iniciar Sesión</h1> <form><div class="form-group svelte-1gi6e0m"><label for="email" class="svelte-1gi6e0m">Email</label> <input type="email" id="email"${attr("value", email)} required placeholder="ejemplo@email.com"${attr("disabled", isLoading, true)} class="svelte-1gi6e0m"/></div> <div class="form-group svelte-1gi6e0m"><label for="password" class="svelte-1gi6e0m">Contraseña</label> <input type="password" id="password"${attr("value", password)} required placeholder="••••••••"${attr("disabled", isLoading, true)} class="svelte-1gi6e0m"/></div> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <button type="submit"${attr("disabled", isLoading, true)} class="btn-primary svelte-1gi6e0m">`;
  {
    $$payload.out += "<!--[!-->";
    $$payload.out += `Iniciar Sesión`;
  }
  $$payload.out += `<!--]--></button></form> <div class="auth-links svelte-1gi6e0m"><a href="/signup" class="svelte-1gi6e0m">¿No tienes cuenta? Regístrate</a> <a href="/help" class="svelte-1gi6e0m">¿Olvidaste tu contraseña?</a></div></div></div>`;
  pop();
}
export {
  _page as default
};
