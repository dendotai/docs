# Setting Up a Documentation Worker for docs.den.ai

This guide explains how to configure your Fumadocs documentation project as a private Cloudflare Worker that integrates with the docs.den.ai router.

## Overview

Your documentation will be:

- Deployed as a **private worker** (no public routes)
- Accessed only through **service bindings** from the router
- Available at `docs.den.ai/yourproject/`

## Prerequisites

- Cloudflare account with Workers enabled
- `wrangler` CLI installed
- Fumadocs project built to static files

## Step-by-Step Setup

### 1. Create wrangler.jsonc

Create a `wrangler.jsonc` file in your documentation project root:

```jsonc
{
  "$schema": "https://unpkg.com/wrangler@latest/config-schema.json",
  "name": "myproject-docs",
  "main": "dist/_worker.js",
  "compatibility_date": "2024-01-01",
  
  // IMPORTANT: No routes section - keeps the worker private
  
  "site": {
    "bucket": "./dist"  // Your build output directory
  }
}
```

### 2. Configure Fumadocs

Set the basePath to match your project ID in `app.config.ts`:

```typescript
export default {
  basePath: '/myproject',  // Can also use: process.env.BASE_PATH || '/myproject'
}
```

Using environment variables allows flexible configuration:

```typescript
export default {
  basePath: process.env.DOCS_BASE_PATH || '/myproject',
}
```

### 3. Build Your Documentation

Build your Fumadocs project to static files:

```bash
npm run build
```

### 4. Deploy to Cloudflare

Deploy your documentation as a private worker:

```bash
# Deploy with specific name
wrangler deploy --name myproject-docs

# First time deployment
wrangler deploy --name myproject-docs --compatibility-date 2024-01-01
```

### 5. Register with Router

Contact the docs.den.ai maintainer to add your project:

1. **Service binding** in router's `wrangler.jsonc`
2. **Type definition** in router's `env.ts`
3. **Project metadata** in router's `projects.ts`

Or submit a PR with these changes.

## Worker Script

Fumadocs typically generates the worker script automatically, but if you need to customize it:

```javascript
// dist/_worker.js
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

export default {
  async fetch(request, env, ctx) {
    try {
      // Optional: Add SEO protection
      const response = await getAssetFromKV({
        request,
        waitUntil: ctx.waitUntil.bind(ctx),
      });
      
      // Add headers for router identification
      if (!request.headers.get('X-Forwarded-By-Router')) {
        response.headers.set('X-Robots-Tag', 'noindex, nofollow');
      }
      
      return response;
    } catch (e) {
      // Handle 404s
      return new Response('Not found', { status: 404 });
    }
  },
};
```

## Troubleshooting

### "Module not found: @cloudflare/kv-asset-handler"

Install the required dependency:

```bash
npm install --save-dev @cloudflare/kv-asset-handler
```

### Assets not loading (404 errors)

1. Check your Fumadocs basePath configuration
2. Ensure all assets use relative paths
3. Verify the `bucket` path in wrangler.jsonc matches your build output

### Worker is publicly accessible

1. Ensure NO `routes` section in wrangler.jsonc
2. Optionally disable workers.dev subdomain in Cloudflare dashboard:
   - Go to Workers & Pages
   - Select your worker
   - Settings → Domains & Routes
   - Disable workers.dev route

### Styles or JavaScript not loading

- Ensure basePath is correctly configured
- Use Fumadocs' built-in asset handling
- Avoid hardcoded absolute paths

## Best Practices

1. **Naming**: Use simple names like `myproject-docs` (not `myproject-docs-worker`)
2. **Environment Variables**: Use env vars for basePath to allow flexible deployment
3. **Testing**: Always test locally before deploying
4. **SEO**: Implement header checks to prevent indexing of worker URLs
5. **Caching**: Configure appropriate cache headers for static assets

## Example Configuration

Here's a complete example for a project called "muxa":

**app.config.ts**:

```typescript
export default {
  basePath: process.env.BASE_PATH || '/muxa',
}
```

**wrangler.jsonc**:

```jsonc
{
  "name": "muxa-docs",
  "main": "dist/_worker.js",
  "compatibility_date": "2024-01-01",
  "site": {
    "bucket": "./dist"
  }
}
```

**Deploy command**:

```bash
wrangler deploy --name muxa-docs
```

## Need Help?

- Check the [main README](./README.md) for router setup
- Review [Fumadocs documentation](https://fumadocs.vercel.app/)
- Ensure you're in the same Cloudflare account as the router
