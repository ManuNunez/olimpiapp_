import "clsx";
import { a as attr } from "../../chunks/attributes.js";
import { x as getContext, w as pop, u as push } from "../../chunks/index.js";
import { s as stores } from "../../chunks/client.js";
({
  check: stores.updated.check
});
function context() {
  return getContext("__request__");
}
const page$1 = {
  get url() {
    return context().page.url;
  }
};
const page = page$1;
function Header($$payload, $$props) {
  push();
  $$payload.out += `<header class="svelte-1ydyov6"><div class="logo svelte-1ydyov6"><a href="/" class="svelte-1ydyov6"><span class="logo-icon svelte-1ydyov6">🏆</span> <span class="logo-text svelte-1ydyov6">OlimpiApp</span></a></div> <nav class="svelte-1ydyov6"><ul class="svelte-1ydyov6"><li${attr("aria-current", page.url.pathname === "/" ? "page" : void 0)} class="svelte-1ydyov6"><a href="/" class="svelte-1ydyov6">Inicio</a></li> `;
  {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<li${attr("aria-current", page.url.pathname === "/login" ? "page" : void 0)} class="svelte-1ydyov6"><a href="/login" class="svelte-1ydyov6">Iniciar Sesión</a></li> <li${attr("aria-current", page.url.pathname === "/signup" ? "page" : void 0)} class="svelte-1ydyov6"><a href="/signup" class="svelte-1ydyov6">Registrarse</a></li>`;
  }
  $$payload.out += `<!--]--></ul></nav> <div class="user-actions svelte-1ydyov6">`;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div></header>`;
  pop();
}
function _layout($$payload, $$props) {
  let { children } = $$props;
  $$payload.out += `<div class="app svelte-1cnq626">`;
  Header($$payload);
  $$payload.out += `<!----> <main class="svelte-1cnq626">`;
  children($$payload);
  $$payload.out += `<!----></main> <footer class="svelte-1cnq626"><div class="footer-content svelte-1cnq626"><div class="footer-section svelte-1cnq626"><h4 class="svelte-1cnq626">OlimpiApp</h4> <p class="svelte-1cnq626">Plataforma para la gestión de olimpiadas académicas</p></div> <div class="footer-section svelte-1cnq626"><h4 class="svelte-1cnq626">Enlaces</h4> <ul class="svelte-1cnq626"><li class="svelte-1cnq626"><a href="/" class="svelte-1cnq626">Inicio</a></li></ul></div> <div class="footer-section svelte-1cnq626"><h4 class="svelte-1cnq626">Soporte</h4> <ul class="svelte-1cnq626"><li class="svelte-1cnq626"><a href="/help" class="svelte-1cnq626">Ayuda</a></li></ul></div></div> <div class="footer-bottom svelte-1cnq626"><p>© 2024 OlimpiApp. Todos los derechos reservados.</p></div></footer></div>`;
}
export {
  _layout as default
};
