import { readFileSync } from "node:fs";
import { resolve } from "node:path";

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

export const CSSLinks = ({ href }: { href: string }) => {
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
			<link rel="stylesheet" href={href} />
		</>
	);
};

export const JSScripts = ({ src }: { src: string }) => {
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
			<script type="module" src={src} />
		</>
	);
};
