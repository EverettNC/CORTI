import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as GROK_PROVIDERS } from "./router-DkjjxIoD.mjs";
import { i as signIn, t as Button } from "./client-CkmXsD7L.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-OxxM5p9f.js
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-bg px-6 text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[0.625rem] uppercase tracking-[0.32em] text-subtle",
						children: "Christman"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-sans text-3xl font-light tracking-[0.22em]",
						children: "CORTI"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted",
						children: "Sign in if you want a name on this session. Hearing does not require it."
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						className: "w-full",
						onClick: () => signIn(p.providerId, { callbackURL: "/" }),
						children: ["Continue with ", p.label]
					}, p.providerId))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "inline-block font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-subtle hover:text-fg",
					children: "Back to the cochlea"
				})
			]
		})
	});
}
//#endregion
export { Login as component };
