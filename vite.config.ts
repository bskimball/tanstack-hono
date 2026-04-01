/// <reference types="vite-plus" />

import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import devServer, { defaultOptions } from "@hono/vite-dev-server";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite-plus";
import { analyzer } from "vite-bundle-analyzer";
import "dotenv/config";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const port = process.env.NODE_SERVER_PORT
	? Number.parseInt(process.env.NODE_SERVER_PORT, 10)
	: 3000;
const host = process.env.NODE_SERVER_HOST || "localhost";

const isClientBuild = process.env.CLIENT_BUILD === "true";

const ssrBuild = {
	outDir: "dist/server",
	ssrEmitAssets: false,
	copyPublicDir: false,
	emptyOutDir: false,
	rollupOptions: {
		input: resolve(__dirname, "src/entry-server.tsx"),
		output: {
			entryFileNames: "index.js",
			chunkFileNames: "assets/[name]-[hash].js",
			assetFileNames: "assets/[name]-[hash][extname]",
		},
	},
	ssr: true,
};

const clientBuild = {
	outDir: "dist/client",
	copyPublicDir: true,
	emptyOutDir: true,
	rollupOptions: {
		input: resolve(__dirname, "src/entry-client.tsx"),
		output: {
			entryFileNames: "static/[name].js",
			chunkFileNames: "static/[name]-[hash].js",
			assetFileNames: "static/[name]-[hash][extname]",
		},
	},
	manifest: true,
};

export default defineConfig({
	staged: {
		"*": "vp check --fix",
	},
	lint: {
		plugins: ["oxc", "typescript", "unicorn", "react"],
		categories: {
			correctness: "warn",
		},
		env: {
			builtin: true,
		},
		ignorePatterns: [
			"dist/**",
			"node_modules/**",
			"src/routeTree.gen.ts",
			"*.config.js",
			"*.config.ts",
		],
		rules: {
			"constructor-super": "error",
			"for-direction": "error",
			"getter-return": "error",
			"no-async-promise-executor": "error",
			"no-case-declarations": "error",
			"no-class-assign": "error",
			"no-compare-neg-zero": "error",
			"no-cond-assign": "error",
			"no-const-assign": "error",
			"no-constant-binary-expression": "error",
			"no-constant-condition": "error",
			"no-control-regex": "error",
			"no-debugger": "error",
			"no-delete-var": "error",
			"no-dupe-class-members": "error",
			"no-dupe-else-if": "error",
			"no-dupe-keys": "error",
			"no-duplicate-case": "error",
			"no-empty": "error",
			"no-empty-character-class": "error",
			"no-empty-pattern": "error",
			"no-empty-static-block": "error",
			"no-ex-assign": "error",
			"no-extra-boolean-cast": "error",
			"no-fallthrough": "error",
			"no-func-assign": "error",
			"no-global-assign": "error",
			"no-import-assign": "error",
			"no-invalid-regexp": "error",
			"no-irregular-whitespace": "error",
			"no-loss-of-precision": "error",
			"no-misleading-character-class": "error",
			"no-new-native-nonconstructor": "error",
			"no-nonoctal-decimal-escape": "error",
			"no-obj-calls": "error",
			"no-prototype-builtins": "error",
			"no-redeclare": "error",
			"no-regex-spaces": "error",
			"no-self-assign": "error",
			"no-setter-return": "error",
			"no-shadow-restricted-names": "error",
			"no-sparse-arrays": "error",
			"no-this-before-super": "error",
			"no-undef": "error",
			"no-unexpected-multiline": "error",
			"no-unreachable": "error",
			"no-unsafe-finally": "error",
			"no-unsafe-negation": "error",
			"no-unsafe-optional-chaining": "error",
			"no-unused-labels": "error",
			"no-unused-private-class-members": "error",
			"no-unused-vars": "error",
			"no-useless-backreference": "error",
			"no-useless-catch": "error",
			"no-useless-escape": "error",
			"no-with": "error",
			"require-yield": "error",
			"use-isnan": "error",
			"valid-typeof": "error",
			"no-array-constructor": "error",
			"no-unused-expressions": "error",
			"typescript/ban-ts-comment": "error",
			"typescript/no-duplicate-enum-values": "error",
			"typescript/no-empty-object-type": "error",
			"typescript/no-explicit-any": "error",
			"typescript/no-extra-non-null-assertion": "error",
			"typescript/no-misused-new": "error",
			"typescript/no-namespace": "error",
			"typescript/no-non-null-asserted-optional-chain": "error",
			"typescript/no-require-imports": "error",
			"typescript/no-this-alias": "error",
			"typescript/no-unnecessary-type-constraint": "error",
			"typescript/no-unsafe-declaration-merging": "error",
			"typescript/no-unsafe-function-type": "error",
			"typescript/no-wrapper-object-types": "error",
			"typescript/prefer-as-const": "error",
			"typescript/prefer-namespace-keyword": "error",
			"typescript/triple-slash-reference": "error",
		},
		overrides: [
			{
				files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
				rules: {
					"constructor-super": "off",
					"getter-return": "off",
					"no-class-assign": "off",
					"no-const-assign": "off",
					"no-dupe-class-members": "off",
					"no-dupe-keys": "off",
					"no-func-assign": "off",
					"no-import-assign": "off",
					"no-new-native-nonconstructor": "off",
					"no-obj-calls": "off",
					"no-redeclare": "off",
					"no-setter-return": "off",
					"no-this-before-super": "off",
					"no-undef": "off",
					"no-unreachable": "off",
					"no-unsafe-negation": "off",
					"no-var": "error",
					"no-with": "off",
					"prefer-const": "error",
					"prefer-rest-params": "error",
					"prefer-spread": "error",
				},
			},
			{
				files: ["**/*.{ts,tsx,js,jsx}"],
				rules: {
					"react/display-name": "error",
					"react/jsx-key": "error",
					"react/jsx-no-comment-textnodes": "error",
					"react/jsx-no-duplicate-props": "error",
					"react/jsx-no-target-blank": "error",
					"react/jsx-no-undef": "error",
					"react/no-children-prop": "error",
					"react/no-danger-with-children": "error",
					"react/no-direct-mutation-state": "error",
					"react/no-find-dom-node": "error",
					"react/no-is-mounted": "error",
					"react/no-render-return-value": "error",
					"react/no-string-refs": "error",
					"react/no-unescaped-entities": "error",
					"react/no-unknown-property": "error",
					"react/no-unsafe": "off",
					"react/react-in-jsx-scope": "off",
					"react/require-render-return": "error",
					"no-unused-vars": [
						"warn",
						{
							argsIgnorePattern: "^_",
							varsIgnorePattern: "^_",
						},
					],
					"react/rules-of-hooks": "error",
					"react/exhaustive-deps": "warn",
					"typescript/no-explicit-any": "warn",
				},
				env: {
					es2022: true,
					browser: true,
					node: true,
				},
			},
		],
		options: {
			typeAware: true,
			typeCheck: true,
		},
	},
	fmt: {
		useTabs: true,
		tabWidth: 2,
		semi: true,
		singleQuote: false,
		trailingComma: "es5",
		printWidth: 100,
		sortPackageJson: false,
		ignorePatterns: ["dist/", "node_modules/", "src/routeTree.gen.ts", "package-lock.json", "*.md"],
	},
	plugins: [
		tanstackRouter({ autoCodeSplitting: true }),
		...(() => {
			const reactPlugins = viteReact({
				babel: {
					plugins: ["babel-plugin-react-compiler"],
				},
			});
			const babelPlugin = reactPlugins.find((p) => p && p.name === "vite:react-babel");
			if (babelPlugin && typeof babelPlugin.config === "function") {
				const origConfig = babelPlugin.config;
				babelPlugin.config = function (config, env) {
					const res = (origConfig.call(this as never, config, env) || {}) as Record<
						string,
						unknown
					>;
					if (res.esbuild && typeof res.esbuild === "object") {
						const esbuild = res.esbuild as Record<string, unknown>;
						res.oxc = {
							jsx: {
								runtime: esbuild.jsx === "automatic" ? "automatic" : "classic",
								importSource: esbuild.jsxImportSource || "react",
								refresh: env.command === "serve",
							},
							jsxRefreshInclude: /\.([tj]sx?)$/,
							jsxRefreshExclude: /\/node_modules\//,
						};
						delete res.esbuild;
					}
					if (res.optimizeDeps && typeof res.optimizeDeps === "object") {
						const optimizeDeps = res.optimizeDeps as Record<string, unknown>;
						if (optimizeDeps.esbuildOptions) {
							optimizeDeps.rolldownOptions = {
								transform: { jsx: { runtime: "automatic" } },
							};
							delete optimizeDeps.esbuildOptions;
						}
					}
					return res;
				};
			}
			return reactPlugins;
		})(),
		tailwindcss(),
		devServer({
			entry: "src/entry-server.tsx",
			injectClientScript: false,
			exclude: [
				/^\/src\/.+/, // Allow Vite to handle /src/ requests
				...defaultOptions.exclude,
			],
		}),
		// Add bundle analyzer only when --analyze flag is used
		...(process.argv.includes("--analyze") ? [analyzer()] : []),
	],
	build: isClientBuild ? clientBuild : ssrBuild,
	test: {
		globals: true,
		environment: "jsdom",
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
	server: {
		host,
		port,
	},
	// Ensure proper dev server handling
	optimizeDeps: {
		include: ["react", "react-dom", "@tanstack/react-router"],
		exclude: ["web-vitals"],
	},
});
