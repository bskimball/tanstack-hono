import type { AnyRouter } from "@tanstack/react-router";
import {
	RouterServer,
	createRequestHandler,
	renderRouterToString,
} from "@tanstack/react-router/ssr/server";
import { createMiddleware } from "hono/factory";

interface Props {
	router: AnyRouter;
}

export const tanstackRouterHandler = ({ router }: Props) => {
	return createMiddleware(async (c) => {
		const requestHandler = createRequestHandler({
			request: c.req.raw,
			createRouter: () => router,
		});
		return await requestHandler(({ responseHeaders, router }) => {
			return renderRouterToString({
				responseHeaders,
				router,
				children: (
					<html lang="en">
						<head>
							<title>Testing</title>
							{process.env.NODE_ENV === "production" ? (
								<>
									<meta
										name="viewport"
										content="width=device-width, initial-scale=1"
									/>
									<link
										rel="icon"
										type="image/x-icon"
										href="/src/favicon.ico"
									/>
								</>
							) : (
								<>
									<link rel="stylesheet" href="/src/styles.css" />
									<script type="module" src="/src/entry-client.tsx" />
								</>
							)}
						</head>
						<body>
							<RouterServer router={router} />
						</body>
					</html>
				),
			});
		});
	});
};
