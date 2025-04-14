import { e as createComponent, f as createAstro, h as addAttribute, i as renderHead, j as renderSlot, r as renderTemplate, k as renderComponent, l as renderScript, m as maybeRenderHead } from '../chunks/astro/server_8u5ktLLM.mjs';
import 'kleur/colors';
import 'html-escaper';
import 'clsx';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title = "Porter Track - Hospital Transportation Management" } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="description" content="Hospital porter task management application"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title>${renderHead()}</head> <body> <div class="container"> ${renderSlot($$result, $$slots["default"])} </div> </body></html>`;
}, "/Users/martin/Desktop/porter-track/porter-track-refresh/src/layouts/Layout.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Porter Track - Hospital Transportation Management" }, { "default": ($$result2) => renderTemplate` ${renderScript($$result2, "/Users/martin/Desktop/porter-track/porter-track-refresh/src/pages/index.astro?astro&type=script&index=0&lang.ts")} ${maybeRenderHead()}<div id="app"></div> ` })}`;
}, "/Users/martin/Desktop/porter-track/porter-track-refresh/src/pages/index.astro", void 0);

const $$file = "/Users/martin/Desktop/porter-track/porter-track-refresh/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
