import { A as maybe_selected } from "../../../chunks/index.js";
import { a as attr } from "../../../chunks/attributes.js";
function _page($$payload) {
  let name = "";
  let username = "";
  let email = "";
  let password = "";
  let password_confirmation = "";
  let role_id = "2";
  let isLoading = false;
  $$payload.out += `<div class="auth-container svelte-10n7mko"><div class="auth-card svelte-10n7mko"><h1 class="svelte-10n7mko">Crear cuenta</h1> <form><div class="form-group svelte-10n7mko"><label for="name" class="svelte-10n7mko">Nombre completo</label> <input type="text" id="name"${attr("value", name)} required placeholder="Juan Pérez"${attr("disabled", isLoading, true)} class="svelte-10n7mko"/></div> <div class="form-group svelte-10n7mko"><label for="username" class="svelte-10n7mko">Usuario</label> <input type="text" id="username"${attr("value", username)} required placeholder="juanperez123"${attr("disabled", isLoading, true)} class="svelte-10n7mko"/></div> <div class="form-group svelte-10n7mko"><label for="email" class="svelte-10n7mko">Correo electrónico</label> <input type="email" id="email"${attr("value", email)} required placeholder="correo@ejemplo.com"${attr("disabled", isLoading, true)} class="svelte-10n7mko"/></div> <div class="form-group svelte-10n7mko"><label for="password" class="svelte-10n7mko">Contraseña</label> <input type="password" id="password"${attr("value", password)} required placeholder="••••••••"${attr("disabled", isLoading, true)} class="svelte-10n7mko"/></div> <div class="form-group svelte-10n7mko"><label for="password_confirmation" class="svelte-10n7mko">Confirmar contraseña</label> <input type="password" id="password_confirmation"${attr("value", password_confirmation)} required placeholder="••••••••"${attr("disabled", isLoading, true)} class="svelte-10n7mko"/></div> <div class="form-group svelte-10n7mko"><label for="role_id" class="svelte-10n7mko">Rol</label> <select id="role_id"${attr("disabled", isLoading, true)} required class="svelte-10n7mko">`;
  $$payload.select_value = role_id;
  $$payload.out += `<option value="2"${maybe_selected($$payload, "2")}>Estudiante</option><option value="3"${maybe_selected($$payload, "3")}>Maestro</option>`;
  $$payload.select_value = void 0;
  $$payload.out += `</select></div> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <button type="submit"${attr("disabled", isLoading, true)} class="btn-primary svelte-10n7mko">`;
  {
    $$payload.out += "<!--[!-->";
    $$payload.out += `Registrarse`;
  }
  $$payload.out += `<!--]--></button></form> <div class="auth-links svelte-10n7mko"><a href="/login" class="svelte-10n7mko">¿Ya tienes cuenta? Inicia sesión</a></div></div></div>`;
}
export {
  _page as default
};
