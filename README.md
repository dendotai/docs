# Cloudflare Documentation Router System

A centralized router for hosting multiple documentation sites under docs.den.ai using Cloudflare Workers and Service Bindings.

## Overview

This system provides:

- **Single entry point** at docs.den.ai for all documentation
- **Service bindings** for secure, fast internal communication  
- **Private documentation workers** (not publicly accessible) hosted in the projects' repos
- **Clean URLs** like `docs.den.ai/muxa/getting-started`
- **Project isolation** with independent deployment cycles

## Quick Start

Install dependencies:

```bash
bun install
```

Run development server:

```bash
# From root directory
bun run dev
```

Or run just the router:

```bash
cd apps/router && bun run dev
```

Build all packages:

```bash
bun run build
```

Deploy router to production:

```bash
bun run deploy
```

## Architecture

```text
        User Request
             ↓
    docs.den.ai/[project]/[path]
             ↓
       Router Worker
             ↓
      Service Binding
             ↓
   Private Documentation Worker
```

## Adding a New Documentation Project

### Step 1: Deploy Your Documentation Worker

For detailed Fumadocs setup instructions, see [SETUP_DOCUMENTATION_WORKER.md](./docs/SETUP_DOCUMENTATION_WORKER.md).

### Step 2: Configure the Router

1. **Add service binding** in `apps/router/wrangler.jsonc`:

```jsonc
"services": [
  {
    "binding": "MUXA_DOCS",
    "service": "muxa-docs"
  },
  {
    "binding": "NEW_PROJECT_DOCS",
    "service": "new-project-docs"  // Your new project
  }
]
```

1. **Add type definition** in `apps/router/src/env.ts`:

```typescript
export interface Env {
  MUXA_DOCS: Fetcher;
  NEW_PROJECT_DOCS: Fetcher;  // Your new project
  // ...
}
```

1. **Add project metadata** in `apps/router/src/config/projects.ts`:

```typescript
export const PROJECTS = {
  muxa: { /* ... */ },
  newproject: {  // Your new project
    id: "new-project",
    name: "New Project",
    description: "Description of your project",
  },
};
```

### Step 3: Deploy Router Updates

```bash
cd apps/router
bun run deploy
```

Your documentation will now be available at `https://docs.den.ai/new-project/`

## Key Concepts

### Service Bindings

- Enable worker-to-worker communication within Cloudflare
- No public URLs needed for documentation workers
- Faster than HTTP requests (no network round-trip)
- More secure (workers not accessible from internet)

### Private Workers

- Deployed without routes (no public access)
- Only accessible via service bindings
- Provides complete control at the router level

### Path Forwarding

- Router forwards the FULL path to documentation workers
- Example: `docs.den.ai/muxa/guide` → `[private-worker]/muxa/guide` (not stripped)
- Documentation frameworks handle the prefix via basePath configuration

## Development

### Router Development Workflow

#### Starting Development

```bash
# Option 1: From the root directory (recommended)
bun run dev

# Option 2: From the router directory
cd apps/router
bun run dev
```

The router will start at `http://localhost:8787`

#### What You Can Test Locally

- **Landing Page**: Visit `http://localhost:8787/` to see the project listing
- **Project Routes**: Access documentation at `http://localhost:8787/[project-id]/`
- **404 Handling**: Test non-existent routes to see error pages

#### Development Commands

```bash
# Run type checking
bun run typecheck

# View Wrangler logs during development
wrangler tail  # In another terminal while dev server is running
```

### Testing with Local Documentation

For local development with service bindings:

```bash
# Terminal 1: Start your documentation worker
cd your-docs-project
wrangler dev --local

# Terminal 2: Start the router
cd apps/router
wrangler dev --local

# Access via: http://localhost:8787/yourproject/
```

**Note**: Local service bindings require both workers running with `--local` flag.

## Deployment

### Pre-deployment Checklist

1. Run type checking: `bun run typecheck`
2. Test locally: `bun run dev`
3. Verify all project URLs in `apps/router/src/config/projects.ts` are correct
4. Ensure you're logged into Wrangler: `wrangler whoami`

### Deploy Router to Cloudflare

```bash
# From root directory (recommended)
bun run deploy

# Or from router directory
cd apps/router
bun run deploy
```

### Verify Deployment

After deployment:

1. Visit `https://docs.den.ai/` to see the landing page
2. Test a documentation project: `https://docs.den.ai/muxa/`
3. Check deployment logs: `wrangler tail --name docs-router`

### Deploy Everything

```bash
# Build all packages first
bun run build

# Deploy router
bun run deploy

## Environment Variables

Environment variables can be configured in `apps/router/wrangler.jsonc`. See the configuration file for current settings.

## Common Development Tasks

### Adding a New Project to the Router

1. Edit `apps/router/src/config/projects.ts`
2. Add your project configuration
3. Test locally: `bun run dev`
4. Deploy: `bun run deploy`

### Modifying the Landing Page

1. Edit `apps/router/src/pages/landing.tsx`
2. Test changes at `http://localhost:8787/`
3. Deploy when ready

### Debugging Routing Issues

```bash
# Check router logs during development
wrangler tail --name docs-router

# Test specific routes
curl -I http://localhost:8787/your-project/
curl -I http://localhost:8787/your-project/some-page
```

## Troubleshooting

### "No service binding found"

- Ensure the worker is deployed with the exact name in wrangler.jsonc
- Check that the binding is added to env.ts
- Verify both workers are in the same Cloudflare account

### 404 errors for documentation pages

- Verify the documentation framework has the correct basePath (e.g., `/muxa`)
- Check that the worker is deployed and running
- Ensure the project is added to projects.ts

### Documentation worker is publicly accessible

- Remove any `routes` from the documentation worker's wrangler.jsonc
- Redeploy the documentation worker
- Optionally disable the workers.dev subdomain in Cloudflare dashboard

### Router not starting locally

- Ensure you're using bun: `bun --version`
- Check if port 8787 is available
- Try clearing cache: `rm -rf node_modules && bun install`

### SEO concerns

- Implement the `X-Forwarded-By-Router` header check
- Add canonical URLs pointing to docs.den.ai
- Include robots.txt blocking direct access

## License

See LICENSE file in the repository root.
