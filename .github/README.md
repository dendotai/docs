# GitHub Actions Setup for Cloudflare Deployment

## Required GitHub Secrets

Before the deployment workflow can run successfully, you need to configure the following secrets in your GitHub repository:

### 1. CLOUDFLARE_API_TOKEN

Create a Cloudflare API token with the following settings:

#### Permissions

- Account: Workers Scripts : Edit
- Zone: Zone : Read

#### Account Resources

- Include: The account

#### Zone Resources

- Include : Specific zone : den.ai

To create the token:

1. Go to <https://dash.cloudflare.com/profile/api-tokens>
2. Click "Create Token"
3. Use the "Custom token" template
4. Add the permissions mentioned above
5. Copy the generated token

### 2. CLOUDFLARE_ACCOUNT_ID

Find your Cloudflare Account ID:

1. Go to the Cloudflare dashboard
2. Select your account
3. The Account ID is shown in the right sidebar

### Adding Secrets to GitHub

1. Go to your repository on GitHub
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each secret:
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: Your Cloudflare API token

   - Name: `CLOUDFLARE_ACCOUNT_ID`
   - Value: Your Cloudflare Account ID

## Workflow Behavior

- **On push to main**: Automatically deploys to Cloudflare Workers
- **On pull request**: Runs typecheck and performs a dry-run deployment
- The deployment uses the configuration from `apps/router/wrangler.jsonc`
- The worker will be deployed with the route `docs.den.ai/*`
