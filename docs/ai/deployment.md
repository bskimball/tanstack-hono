# Performance And Deployment Notes

## Performance

- SSR is enabled by default (SEO + faster first paint)
- Default SSR mode is non-streaming; streaming is optional
- Consider code splitting with `React.lazy()` if bundles grow

If you enable streaming SSR, make sure the deployment target and response pipeline
support streaming responses correctly.

## Runtime / Assets

- Server entry: `dist/server/index.js`
- Static assets: served from `dist/client/`

## Production Middleware

- Compression: enabled via Hono middleware in production

## Deployment Targets

Common options include container (Docker), serverless (Vercel/Netlify), or traditional container hosts (Railway/Render).
