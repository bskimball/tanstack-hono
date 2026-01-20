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

const router = createRouter({
	appCssHrefs: getInitialAppCssHrefs(),
});

hydrateRoot(document, <RouterClient router={router} />);

// Only report web vitals in development
if (import.meta.env.DEV) {
	reportWebVitals(console.log);
}
