import { RouterClient } from "@tanstack/react-router/ssr/client";
import { hydrateRoot } from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { createRouter } from "./router";

import "./styles.css";

function getInitialAppCssHrefs() {
	const links = document.querySelectorAll<HTMLLinkElement>("link[data-app-css]");
	return Array.from(links)
		.map((link) => {
			try {
				return new URL(link.href).pathname;
			} catch {
				return null;
			}
		})
		.filter((href): href is string => Boolean(href));
}

function getInitialClientEntrySrc() {
	const script = document.querySelector<HTMLScriptElement>("script[data-app-entry]");
	if (!script) return "";
	try {
		return new URL(script.src).pathname;
	} catch {
		return "";
	}
}

const router = createRouter({
	appCssHrefs: getInitialAppCssHrefs(),
	clientEntrySrc: getInitialClientEntrySrc(),
});

hydrateRoot(document, <RouterClient router={router} />);

// Only report web vitals in development
if (import.meta.env.DEV) {
	reportWebVitals(console.log);
}
