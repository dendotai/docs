export interface DocumentationProject {
  id: string;
  name: string;
  description: string;
}

// Configuration for documentation projects accessible via service bindings
// Each project must:
// 1. Have a corresponding service binding in wrangler.jsonc
// 2. Have a typed binding in env.ts (e.g., MUXA_DOCS: Fetcher)
// 3. Be deployed as a worker without routes: wrangler deploy --name muxa-docs
// 4. Have basePath configured to match the project ID (e.g., basePath: '/muxa')
export const PROJECTS: Record<string, DocumentationProject> = {
  muxa: {
    id: "muxa",
    name: "muxa",
    description:
      "Run your entire dev stack in multiple virtual terminals with one concise command instead of long config files. Built-in monorepo support, preserved interactivity, and clean output.",
  },
  // Add more projects here as needed
  // Example:
  // myproject: {
  //   id: 'myproject',
  //   name: 'My Project',
  //   description: 'Description of your project documentation',
  // },
};
