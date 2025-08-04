/**
 * Documentation Router for docs.den.ai
 *
 * This worker serves as the main entry point for all documentation hosted under docs.den.ai.
 * It uses Cloudflare Service Bindings to route requests to private documentation workers.
 *
 * Architecture:
 * - Public router at docs.den.ai
 * - Private documentation workers (no public routes)
 * - Service bindings for secure, fast communication
 * - Full path forwarding (no stripping)
 */

import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { PROJECTS } from "./config/projects";
import type { Env } from "./env";
import { handleLandingPage } from "./pages/landing";
import { handle404, handleError } from "./utils/error-handlers";

const app = new Hono<{ Bindings: Env }>();

// Middleware
app.use("*", logger());
app.use("*", cors());

// Landing page
app.get("/", handleLandingPage);

// Documentation routing
app.all("/:project/*", async (c) => {
  const projectId = c.req.param("project");

  // Look up project configuration
  const project = PROJECTS[projectId];

  if (!project) {
    return handle404(c, projectId);
  }

  try {
    // Get the service binding for this project
    // Binding names follow the pattern: PROJECT_ID_DOCS (uppercase)
    // Examples:
    //   projectId: "muxa" → bindingName: "MUXA_DOCS" → env.MUXA_DOCS
    //   projectId: "myproject" → bindingName: "MYPROJECT_DOCS" → env.MYPROJECT_DOCS
    const bindingName = `${projectId.toUpperCase()}_DOCS` as keyof Env;
    const binding = c.env[bindingName] as Fetcher | undefined;

    if (!binding) {
      console.error(`No service binding found for ${bindingName}`);
      return handle404(c, projectId);
    }

    // Forward the full path to the documentation worker
    // e.g., /muxa/guide/getting-started -> /muxa/guide/getting-started
    const targetUrl = new URL(c.req.url);

    // Copy original headers and add router metadata
    const headers = new Headers(c.req.raw.headers);
    headers.set("X-Forwarded-By-Router", "docs.den.ai");
    headers.set("X-Original-URL", c.req.url);
    headers.set("X-Project-ID", projectId);

    // Create new request with the full path
    const modifiedRequest = new Request(targetUrl.toString(), {
      method: c.req.method,
      headers: headers,
      body: c.req.raw.body,
    });

    // Forward the request using service binding
    const response = await binding.fetch(modifiedRequest);

    // Return the response from the documentation worker
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch (error) {
    return handleError(c, error);
  }
});

// 404 handler
app.notFound((c) => handle404(c));

// Error handler
app.onError((err, c) => handleError(c, err));

export default app;
