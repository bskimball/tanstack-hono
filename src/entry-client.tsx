import { RouterClient } from "@tanstack/react-router/ssr/client";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import reportWebVitals from "./reportWebVitals.ts";
import { createRouter } from "./router.tsx";

const router = createRouter();

// Render the app
hydrateRoot(
	document,
	<StrictMode>
		<RouterClient router={router} />
	</StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
