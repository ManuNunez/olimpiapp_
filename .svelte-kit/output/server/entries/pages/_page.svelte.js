import { y as head } from "../../chunks/index.js";
function _page($$payload) {
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>OlimpiApp - Gestión de Olimpiadas Académicas</title>`;
    $$payload2.out += `<meta name="description" content="Aplicación para gestionar olimpiadas académicas"/>`;
  });
  $$payload.out += `<section class="omrch-announcement svelte-rozjhv"><h2 class="svelte-rozjhv">¡Inscripciones Próximamente!</h2> <p class="svelte-rozjhv">Las inscripciones para la <strong>XV edición de la OMRCh</strong> (Olimpiada de la Ribera de Chapala) estarán <strong>por abrirse próximamente</strong>. 
	Mantente atento a nuestras redes y página oficial para no perder la oportunidad de participar en este gran evento.</p></section>`;
}
export {
  _page as default
};
