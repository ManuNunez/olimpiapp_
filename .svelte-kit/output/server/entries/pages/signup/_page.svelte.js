import { A as maybe_selected, w as pop, u as push } from "../../../chunks/index.js";
import { a as attr } from "../../../chunks/attributes.js";
function _page($$payload, $$props) {
  push();
  let name = "";
  let username = "";
  let email = "";
  let password = "";
  let password_confirmation = "";
  let role_id = "2";
  let isLoading = false;
  $$payload.out += `<div class="auth-container svelte-1oieimg"><div class="auth-card svelte-1oieimg"><h1 class="svelte-1oieimg">Crear cuenta</h1> <form><div class="form-group svelte-1oieimg"><label for="name" class="svelte-1oieimg">Nombre completo</label> <input type="text" id="name"${attr("value", name)} required placeholder="Juan Pérez"${attr("disabled", isLoading, true)} class="svelte-1oieimg"/></div> <div class="form-group svelte-1oieimg"><label for="username" class="svelte-1oieimg">Usuario</label> <input type="text" id="username"${attr("value", username)} required placeholder="juanperez123"${attr("disabled", isLoading, true)} class="svelte-1oieimg"/></div> <div class="form-group svelte-1oieimg"><label for="email" class="svelte-1oieimg">Correo electrónico</label> <input type="email" id="email"${attr("value", email)} required placeholder="correo@ejemplo.com"${attr("disabled", isLoading, true)} class="svelte-1oieimg"/></div> <div class="form-group svelte-1oieimg"><label for="password" class="svelte-1oieimg">Contraseña</label> <input type="password" id="password"${attr("value", password)} required placeholder="••••••••"${attr("disabled", isLoading, true)} class="svelte-1oieimg"/></div> <div class="form-group svelte-1oieimg"><label for="password_confirmation" class="svelte-1oieimg">Confirmar contraseña</label> <input type="password" id="password_confirmation"${attr("value", password_confirmation)} required placeholder="••••••••"${attr("disabled", isLoading, true)} class="svelte-1oieimg"/></div> <div class="form-group svelte-1oieimg"><label for="role_id" class="svelte-1oieimg">Rol</label> <select id="role_id"${attr("disabled", isLoading, true)} required class="svelte-1oieimg">`;
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
  $$payload.out += `<!--]--> <button type="submit"${attr("disabled", isLoading, true)} class="btn-primary svelte-1oieimg">`;
  {
    $$payload.out += "<!--[!-->";
    $$payload.out += `Registrarse`;
  }
  $$payload.out += `<!--]--></button></form> <div class="auth-links svelte-1oieimg"><a href="/login" class="svelte-1oieimg">¿Ya tienes cuenta? Inicia sesión</a></div></div></div>`;
  pop();
}
export {
  _page as default
};
