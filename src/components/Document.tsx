import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { AnyRouter } from "@tanstack/react-router";
import { RouterServer } from "@tanstack/react-router/ssr/server";
import type { ReactNode } from "react";

// Type definitions for Vite manifest
interface ManifestEntry {
	file: string;
	src?: string;
	isEntry?: boolean;
	imports?: string[];
	dynamicImports?: string[];
	assets?: string[];
	css?: string[];
}

interface ViteManifest {
	[key: string]: ManifestEntry;
}

// Load manifest dynamically in production
const getManifest = (): ViteManifest | null => {
	if (process.env.NODE_ENV !== "production") {
		return null;
	}

	try {
		const manifestPath = resolve(process.cwd(), "dist/.vite/manifest.json");
		const manifestContent = readFileSync(manifestPath, "utf-8");
		return JSON.parse(manifestContent) as ViteManifest;
	} catch (error) {
		console.error("Failed to load Vite manifest:", error);
		return null;
	}
};

const CSSLinks = () => {
	if (process.env.NODE_ENV === "production") {
		const manifest = getManifest();
		const clientEntry = manifest
			? Object.values(manifest).find((entry) => entry.isEntry)
			: null;

		if (!manifest || !clientEntry) {
			console.warn(
				"Manifest file not found or does not contain an entry with isEntry: true",
			);
			return null;
		}

		return (
			<>
				{/* CSS files directly associated with the entry */}
				{clientEntry.css?.map((cssFile: string) => (
					<link rel="stylesheet" href={`/${cssFile}`} key={cssFile} />
				))}

				{/* CSS files from imported modules */}
				{clientEntry.imports?.map((manifestKey: string) => {
					const importEntry = manifest[manifestKey];
					return importEntry?.css?.map((cssFile: string) => (
						<link rel="stylesheet" href={`/${cssFile}`} key={cssFile} />
					));
				})}

				{/* CSS files from dynamically imported modules */}
				{clientEntry.dynamicImports?.map((manifestKey: string) => {
					const dynamicEntry = manifest[manifestKey];
					return dynamicEntry?.css?.map((cssFile: string) => (
						<link rel="stylesheet" href={`/${cssFile}`} key={cssFile} />
					));
				})}
			</>
		);
	}

	return (
		<>
			<link rel="stylesheet" href="/src/styles.css" />
		</>
	);
};

const JSScripts = () => {
	if (process.env.NODE_ENV === "production") {
		const manifest = getManifest();
		const clientEntry = manifest
			? Object.values(manifest).find((entry) => entry.isEntry)
			: null;

		if (!manifest || !clientEntry) {
			console.warn(
				"Manifest file not found or does not contain an entry with isEntry: true",
			);
			return null;
		}

		return (
			<>
				{/* Main entry script */}
				<script type="module" src={`/${clientEntry.file}`} />

				{/* Preload imports for better performance */}
				{clientEntry.imports?.map((manifestKey: string) => {
					const importEntry = manifest[manifestKey];
					return importEntry ? (
						<link
							rel="modulepreload"
							href={`/${importEntry.file}`}
							key={importEntry.file}
						/>
					) : null;
				})}

				{/* Preload dynamic imports */}
				{clientEntry.dynamicImports?.map((manifestKey: string) => {
					const dynamicEntry = manifest[manifestKey];
					return dynamicEntry ? (
						<link
							rel="modulepreload"
							href={`/${dynamicEntry.file}`}
							key={dynamicEntry.file}
						/>
					) : null;
				})}
			</>
		);
	}

	return (
		<>
			<script type="module" src="/@react-refresh" />
			<script
				type="module"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
				dangerouslySetInnerHTML={{
					__html: `import RefreshRuntime from '/@react-refresh'
                    RefreshRuntime.injectIntoGlobalHook(window)
                    window.$RefreshReg$ = () => {}
                    window.$RefreshSig$ = () => (type) => type
                    window.__vite_plugin_react_preamble_installed__ = true`,
				}}
			/>
			<script type="module" src="/@vite/client" />
			<script type="module" src="/src/entry-client.tsx" />
		</>
	);
};

interface DocumentProps {
	title?: string;
	children: ReactNode;
}

export const Document = ({ title = "Testing", children }: DocumentProps) => {
	return (
		<html lang="en">
			<head>
				<meta charSet="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>{title}</title>
				<CSSLinks />
				<JSScripts />
			</head>
			<body>
				<div id="app">{children}</div>
			</body>
		</html>
	);
};

interface AppShellProps {
	router: AnyRouter;
	title?: string;
}

export const AppShell = ({ router, title }: AppShellProps) => {
	return (
		<Document title={title}>
			<RouterServer router={router} />
		</Document>
	);
};

// Factory function to create AppShell without JSX in the middleware
export const createAppShell = (router: AnyRouter, title?: string) => {
	return <AppShell router={router} title={title} />;
};
