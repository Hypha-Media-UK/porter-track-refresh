import '@astrojs/internal-helpers/path';
import 'kleur/colors';
import 'html-escaper';
import 'clsx';
import { n as NOOP_MIDDLEWARE_HEADER, o as decodeKey } from './chunks/astro/server_8u5ktLLM.mjs';
import 'cookie';
import 'es-module-lexer';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

const codeToStatusMap = {
  // Implemented from tRPC error code table
  // https://trpc.io/docs/server/error-handling#error-codes
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 405,
  CONFLICT: 409,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_CONTENT: 422,
  TOO_MANY_REQUESTS: 429,
  CLIENT_CLOSED_REQUEST: 499,
  INTERNAL_SERVER_ERROR: 500
};
Object.entries(codeToStatusMap).reduce(
  // reverse the key-value pairs
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/martin/Desktop/porter-track/porter-track-refresh/","cacheDir":"file:///Users/martin/Desktop/porter-track/porter-track-refresh/node_modules/.astro/","outDir":"file:///Users/martin/Desktop/porter-track/porter-track-refresh/dist/","srcDir":"file:///Users/martin/Desktop/porter-track/porter-track-refresh/src/","publicDir":"file:///Users/martin/Desktop/porter-track/porter-track-refresh/public/","buildClientDir":"file:///Users/martin/Desktop/porter-track/porter-track-refresh/dist/","buildServerDir":"file:///Users/martin/Desktop/porter-track/porter-track-refresh/.netlify/build/","adapterName":"@astrojs/netlify","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/loadshiftdata","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/loadShiftData\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"loadShiftData","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/loadShiftData.js","pathname":"/api/loadShiftData","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/shifts/task","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/shifts\\/task\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"shifts","dynamic":false,"spread":false}],[{"content":"task","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/shifts/task.js","pathname":"/api/shifts/task","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/shifts","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/shifts\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"shifts","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/shifts/index.js","pathname":"/api/shifts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"inline","content":".header[data-v-655ecad8]{position:relative;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:var(--spacing-md) var(--spacing-md);background-color:#fffc;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);margin-bottom:var(--spacing-xl);position:sticky;top:0;z-index:10;box-shadow:0 1px #0000000d}.header .header-left[data-v-655ecad8]{justify-self:start}.header .header-left .back-button[data-v-655ecad8]{display:flex;align-items:center;color:var(--color-primary);cursor:pointer;padding:var(--spacing-xs);margin-left:-8px;border-radius:var(--border-radius-pill);transition:background-color var(--transition-fast)}.header .header-left .back-button[data-v-655ecad8]:hover{background-color:rgba(var(--color-primary-rgb),.1)}.header .header-left .back-button[data-v-655ecad8]:active{background-color:rgba(var(--color-primary-rgb),.2)}.header .header-title[data-v-655ecad8]{cursor:pointer;text-align:center}.header .header-title h1[data-v-655ecad8]{font-size:var(--font-size-xl);font-weight:var(--font-weight-semibold);color:var(--color-text);margin:0;transition:opacity var(--transition-fast)}.header .header-title h1[data-v-655ecad8]:active{opacity:.7}.header .header-title[data-v-655ecad8]:focus{outline:none}.header .header-right[data-v-655ecad8]{justify-self:end}.header .header-right .action-button[data-v-655ecad8]{background:none;border:none;color:var(--color-primary);font-weight:var(--font-weight-medium);font-size:var(--font-size-base);padding:var(--spacing-xs) var(--spacing-sm);cursor:pointer;border-radius:var(--border-radius-pill);transition:background-color var(--transition-fast)}.header .header-right .action-button[data-v-655ecad8]:hover{background-color:rgba(var(--color-primary-rgb),.1)}.header .header-right .action-button[data-v-655ecad8]:active{background-color:rgba(var(--color-primary-rgb),.2)}.header .shift-status[data-v-655ecad8]{position:absolute;top:100%;left:0;right:0;display:flex;align-items:center;justify-content:center;gap:var(--spacing-xs);padding:var(--spacing-xs);background-color:#ffffffe6;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);font-size:var(--font-size-sm);color:var(--color-text-secondary);box-shadow:0 1px #0000000d}.header .shift-status .status-indicator[data-v-655ecad8]{width:8px;height:8px;background-color:var(--color-success);border-radius:50%;animation:pulse-655ecad8 2s infinite}.header .shift-status span[data-v-655ecad8]{font-weight:var(--font-weight-medium)}@keyframes pulse-655ecad8{0%{opacity:1;transform:scale(1)}50%{opacity:.7;transform:scale(1.1)}to{opacity:1;transform:scale(1)}}@media (max-width: 768px){.header[data-v-655ecad8]{padding:var(--spacing-sm) var(--spacing-sm);margin-bottom:var(--spacing-lg)}.header .header-title h1[data-v-655ecad8]{font-size:var(--font-size-lg)}}.app[data-v-bab0eaef]{display:flex;flex-direction:column;min-height:100vh;width:100%}.app main[data-v-bab0eaef]{flex:1;padding-bottom:var(--spacing-2xl)}\n"},{"type":"external","src":"/assets/index.DnE3S-lK.css"},{"type":"external","src":"/assets/HomeScreen.Da8ime4X.css"},{"type":"external","src":"/assets/TaskScreen.Cp4PJuB9.css"},{"type":"external","src":"/assets/TaskForm.DkRCHN3c.css"},{"type":"inline","content":".tasks-screen[data-v-89c89df6]{max-width:800px;margin:0 auto;padding-bottom:var(--spacing-xl)}.tasks-screen .screen-header[data-v-89c89df6]{margin-bottom:var(--spacing-lg)}.tasks-screen .screen-header h2[data-v-89c89df6]{font-size:var(--font-size-2xl);color:var(--color-pending);margin-bottom:var(--spacing-xs)}.tasks-screen .screen-header .task-count[data-v-89c89df6]{font-size:var(--font-size-md);color:var(--color-text-light);font-weight:500}.tasks-screen .task-list-container[data-v-89c89df6]{background-color:var(--color-surface);border-radius:var(--border-radius);box-shadow:var(--box-shadow);padding:var(--spacing-lg);min-height:400px;margin-bottom:var(--spacing-lg)}.tasks-screen .task-list-container .empty-list[data-v-89c89df6]{display:flex;justify-content:center;align-items:center;min-height:300px}.tasks-screen .task-list-container .empty-list .empty-state[data-v-89c89df6]{text-align:center;color:var(--color-text-light)}.tasks-screen .task-list-container .empty-list .empty-state p[data-v-89c89df6]{font-size:var(--font-size-lg);margin-bottom:var(--spacing-xs)}.tasks-screen .task-list-container .empty-list .empty-state .subtext[data-v-89c89df6]{font-size:var(--font-size-sm);opacity:.7}.tasks-screen .task-list-container .tasks[data-v-89c89df6]{display:flex;flex-direction:column;gap:var(--spacing-md)}.tasks-screen .navigation-buttons[data-v-89c89df6]{display:flex;justify-content:center}.tasks-screen .navigation-buttons button[data-v-89c89df6]{min-width:180px}@media (max-width: 768px){.tasks-screen .navigation-buttons button[data-v-89c89df6]{width:100%}}\n.tasks-screen[data-v-accaed25]{max-width:800px;margin:0 auto;padding-bottom:var(--spacing-xl)}.tasks-screen .screen-header[data-v-accaed25]{margin-bottom:var(--spacing-lg)}.tasks-screen .screen-header h2[data-v-accaed25]{font-size:var(--font-size-2xl);color:var(--color-success);margin-bottom:var(--spacing-xs)}.tasks-screen .screen-header .task-count[data-v-accaed25]{font-size:var(--font-size-md);color:var(--color-text-light);font-weight:500}.tasks-screen .task-list-container[data-v-accaed25]{background-color:var(--color-surface);border-radius:var(--border-radius);box-shadow:var(--box-shadow);padding:var(--spacing-lg);min-height:400px;margin-bottom:var(--spacing-lg)}.tasks-screen .task-list-container .empty-list[data-v-accaed25]{display:flex;justify-content:center;align-items:center;min-height:300px}.tasks-screen .task-list-container .empty-list .empty-state[data-v-accaed25]{text-align:center;color:var(--color-text-light)}.tasks-screen .task-list-container .empty-list .empty-state p[data-v-accaed25]{font-size:var(--font-size-lg);margin-bottom:var(--spacing-xs)}.tasks-screen .task-list-container .empty-list .empty-state .subtext[data-v-accaed25]{font-size:var(--font-size-sm);opacity:.7}.tasks-screen .task-list-container .tasks[data-v-accaed25]{display:flex;flex-direction:column;gap:var(--spacing-md)}.tasks-screen .navigation-buttons[data-v-accaed25]{display:flex;justify-content:center}.tasks-screen .navigation-buttons button[data-v-accaed25]{min-width:180px}@media (max-width: 768px){.tasks-screen .navigation-buttons button[data-v-accaed25]{width:100%}}\n"},{"type":"external","src":"/assets/ShiftArchiveScreen.C--gV9E4.css"},{"type":"external","src":"/assets/ShiftDetailScreen.Bb7Hnekt.css"},{"type":"external","src":"/assets/SettingsScreen.JCwP5ssX.css"},{"type":"inline","content":".task-card[data-v-c2ef5753]{position:relative;background-color:var(--color-surface);border-radius:var(--border-radius);box-shadow:var(--box-shadow);margin-bottom:var(--spacing-md);overflow:hidden;cursor:pointer;transition:transform var(--transition-fast),box-shadow var(--transition-fast)}.task-card[data-v-c2ef5753]:hover{transform:translateY(-2px);box-shadow:var(--box-shadow-strong)}.task-card.is-completed .task-status-indicator[data-v-c2ef5753]{background-color:var(--color-success)}.task-card .task-status-indicator[data-v-c2ef5753]{position:absolute;top:0;left:0;width:4px;height:100%;background-color:var(--color-pending)}.task-card .task-status-indicator.completed[data-v-c2ef5753]{background-color:var(--color-success)}.task-card .task-content[data-v-c2ef5753]{flex:1;padding:var(--spacing-md);padding-left:calc(var(--spacing-md) + 4px)}.task-card .task-content .task-header[data-v-c2ef5753]{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:var(--spacing-sm)}.task-card .task-content .task-header .task-time-and-category[data-v-c2ef5753]{display:flex;flex-direction:column;gap:2px}.task-card .task-content .task-header .task-time-and-category .task-time[data-v-c2ef5753]{font-weight:var(--font-weight-semibold);color:var(--color-primary);font-size:var(--font-size-sm)}.task-card .task-content .task-header .task-time-and-category .task-category[data-v-c2ef5753]{font-weight:var(--font-weight-medium);font-size:var(--font-size-base);color:var(--color-text)}.task-card .task-content .task-header .task-status-badge[data-v-c2ef5753]{font-size:var(--font-size-xs);padding:2px 8px;border-radius:var(--border-radius-pill);font-weight:var(--font-weight-medium)}.task-card .task-content .task-header .task-status-badge.pending[data-v-c2ef5753]{background-color:var(--color-pending);color:#fff}.task-card .task-content .task-header .task-status-badge.completed[data-v-c2ef5753]{background-color:var(--color-success);color:#fff}.task-card .task-content .task-details[data-v-c2ef5753]{margin-bottom:var(--spacing-sm)}.task-card .task-content .task-details .task-type[data-v-c2ef5753]{font-size:var(--font-size-sm);color:var(--color-text);margin-bottom:var(--spacing-xs);font-weight:var(--font-weight-medium)}.task-card .task-content .task-details .task-route[data-v-c2ef5753]{font-size:var(--font-size-sm);color:var(--color-text-light);display:flex;align-items:center;gap:var(--spacing-xs)}.task-card .task-content .task-details .task-route .arrow-icon[data-v-c2ef5753]{color:var(--color-primary);min-width:16px}.task-card .task-content .task-details .task-route .from[data-v-c2ef5753],.task-card .task-content .task-details .task-route .to[data-v-c2ef5753]{padding:2px 6px;background-color:#00000008;border-radius:var(--border-radius-sm)}.task-card .task-content .task-footer[data-v-c2ef5753]{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:var(--spacing-xs);font-size:var(--font-size-xs);padding-top:var(--spacing-xs);border-top:1px solid rgba(0,0,0,.05)}.task-card .task-content .task-footer .task-staff[data-v-c2ef5753]{display:flex;align-items:center;gap:4px;color:var(--color-text-light)}.task-card .task-content .task-footer .task-staff svg[data-v-c2ef5753]{color:var(--color-secondary)}.task-card .task-content .task-footer .task-completed[data-v-c2ef5753]{display:flex;align-items:center;gap:4px;color:var(--color-success);font-weight:var(--font-weight-medium)}.task-card .task-content .task-footer .task-completed svg[data-v-c2ef5753]{color:var(--color-success)}@media (max-width: 480px){.task-card .task-content .task-footer[data-v-c2ef5753]{flex-direction:column;align-items:flex-start;gap:var(--spacing-xs)}}\n"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/martin/Desktop/porter-track/porter-track-refresh/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000noop-actions":"_noop-actions.mjs","\u0000@astro-page:src/pages/api/loadShiftData@_@js":"pages/api/loadshiftdata.astro.mjs","\u0000@astro-page:src/pages/api/shifts/task@_@js":"pages/api/shifts/task.astro.mjs","\u0000@astro-page:src/pages/api/shifts/index@_@js":"pages/api/shifts.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_BNcQCAe2.mjs","/Users/martin/Desktop/porter-track/porter-track-refresh/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_CRn3FAge.mjs","@astrojs/vue/client.js":"assets/client.ozkccL7h.js","/Users/martin/Desktop/porter-track/porter-track-refresh/src/pages/index.astro?astro&type=script&index=0&lang.ts":"assets/index.astro_astro_type_script_index_0_lang.DlRq2Si_.js","/Users/martin/Desktop/porter-track/porter-track-refresh/src/components/HomeScreen.vue":"assets/HomeScreen.9lgsY2Wd.js","/Users/martin/Desktop/porter-track/porter-track-refresh/src/components/TaskScreen.vue":"assets/TaskScreen.DFhYNsb9.js","/Users/martin/Desktop/porter-track/porter-track-refresh/src/components/TaskForm.vue":"assets/TaskForm.C17yAgkM.js","/Users/martin/Desktop/porter-track/porter-track-refresh/src/components/PendingTasksScreen.vue":"assets/PendingTasksScreen.CaUwFo-L.js","/Users/martin/Desktop/porter-track/porter-track-refresh/src/components/CompletedTasksScreen.vue":"assets/CompletedTasksScreen.DJHGhZ1O.js","/Users/martin/Desktop/porter-track/porter-track-refresh/src/components/ShiftArchiveScreen.vue":"assets/ShiftArchiveScreen.BD-uYACj.js","/Users/martin/Desktop/porter-track/porter-track-refresh/src/components/ShiftDetailScreen.vue":"assets/ShiftDetailScreen.DUY5RzgY.js","/Users/martin/Desktop/porter-track/porter-track-refresh/src/components/SettingsScreen.vue":"assets/SettingsScreen.D_9N4ehu.js","/Users/martin/Desktop/porter-track/porter-track-refresh/src/components/TaskCard.vue":"assets/TaskCard.FeN1vt18.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/assets/index.DnE3S-lK.css","/favicon.svg","/assets/CompletedTasksScreen.DJHGhZ1O.js","/assets/HomeScreen.9lgsY2Wd.js","/assets/HomeScreen.Da8ime4X.css","/assets/PendingTasksScreen.CaUwFo-L.js","/assets/SettingsScreen.D_9N4ehu.js","/assets/SettingsScreen.JCwP5ssX.css","/assets/ShiftArchiveScreen.BD-uYACj.js","/assets/ShiftArchiveScreen.C--gV9E4.css","/assets/ShiftDetailScreen.Bb7Hnekt.css","/assets/ShiftDetailScreen.DUY5RzgY.js","/assets/TaskCard.FeN1vt18.js","/assets/TaskForm.C17yAgkM.js","/assets/TaskForm.DkRCHN3c.css","/assets/TaskScreen.Cp4PJuB9.css","/assets/TaskScreen.DFhYNsb9.js","/assets/client.ozkccL7h.js","/assets/index.astro_astro_type_script_index_0_lang.DlRq2Si_.js","/assets/runtime-dom.esm-bundler.CtO1wbqH.js","/data/shifts/current_shift.json","/data/shifts/04-2025/11-04-25-Day_m9d098zk19z6kl2um1m.json","/data/shifts/04-2025/11-04-25-Day_m9d1ky2vcvt7imi3s3m.json","/data/shifts/04-2025/11-04-25-Day_m9d2l3vb5kmpvi9krgq.json","/data/shifts/04-2025/12-04-25-Day_m9e3bzdwthb5nem90eq.json","/data/shifts/04-2025/12-04-25-Day_m9e7w11zvlff56vgikd.json","/data/shifts/04-2025/12-04-25-Day_m9e86ikgt9i38l5fwy.json","/data/shifts/04-2025/12-04-25-Day_m9e8rw3qw4n5h5f45og.json","/data/shifts/04-2025/12-04-25-Day_m9eciy8a1udyikmdo77.json","/data/shifts/04-2025/12-04-25-Day_m9edpbhd4ejlmzivlk7.json","/data/shifts/04-2025/12-04-25-Day_m9ehf5i7xwaf2wgm5dg.json","/data/shifts/04-2025/12-04-25-Day_m9eo6vovj9utpx3depd.json","/data/shifts/04-2025/13-04-25-Day_m9fjrmcs39masr9x55g.json","/data/shifts/04-2025/13-04-25-Day_m9fn2k94lg14d6ttn2l.json","/data/shifts/04-2025/13-04-25-Day_m9fp7af7mxg5d9mvwxm.json"],"buildFormat":"file","checkOrigin":true,"serverIslandNameMap":[],"key":"3IIc4XvreR0MtCnIQZWeCVm66BjBVk1o6jCJe2H5X94="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
