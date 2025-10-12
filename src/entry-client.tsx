import { RouterClient } from "@tanstack/react-router/ssr/client";
import { hydrateRoot } from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { createRouter } from "./router";

const router = createRouter();

hydrateRoot(document, <RouterClient router={router} />);

// Only report web vitals in development
if (import.meta.env.DEV) {
	reportWebVitals(console.log);
}
