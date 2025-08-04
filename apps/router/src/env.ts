export interface Env {
  // Service bindings for documentation workers
  // Each binding follows the pattern: PROJECT_ID_DOCS (uppercase)
  // The service name in wrangler.jsonc should match the deployed worker name
  MUXA_DOCS: Fetcher;

  // Add more documentation worker bindings as needed
  // Examples:
  // DENAI_DOCS: Fetcher;
  // MYPROJECT_DOCS: Fetcher;

  // Environment variables
  ENVIRONMENT?: string;
}
