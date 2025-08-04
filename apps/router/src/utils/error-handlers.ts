import { Context } from "hono";
import type { Env } from "../env";

export const handle404 = (c: Context<{ Bindings: Env }>, project?: string) => {
  const message = project
    ? `Documentation for project "${project}" not found`
    : "Page not found";

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>404 - Not Found</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        :root {
          --bg: #0a0a0a;
          --fg: #ededed;
          --accent: #00d4ff;
          --error: #ff3366;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background: var(--bg);
          color: var(--fg);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        
        .error-container {
          text-align: center;
          max-width: 500px;
        }
        
        .error-code {
          font-size: 8rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--error), var(--accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
        }
        
        h1 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        
        p {
          color: #999;
          margin-bottom: 2rem;
          font-size: 1.1rem;
        }
        
        a {
          display: inline-block;
          padding: 0.75rem 2rem;
          background: var(--accent);
          color: var(--bg);
          text-decoration: none;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        a:hover {
          background: #00ffaa;
          transform: translateY(-2px);
        }
      </style>
    </head>
    <body>
      <div class="error-container">
        <div class="error-code">404</div>
        <h1>Not Found</h1>
        <p>${message}</p>
        <a href="/">Back to Documentation Hub</a>
      </div>
    </body>
    </html>
  `;

  return c.html(html, 404);
};

export const handleError = (c: Context<{ Bindings: Env }>, error: unknown) => {
  console.error("Router error:", error);

  const isDev = c.env.ENVIRONMENT === "development";
  const errorMessage = error instanceof Error ? error.message : "Unknown error";

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>500 - Server Error</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        :root {
          --bg: #0a0a0a;
          --fg: #ededed;
          --accent: #00d4ff;
          --error: #ff3366;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background: var(--bg);
          color: var(--fg);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        
        .error-container {
          text-align: center;
          max-width: 600px;
        }
        
        .error-code {
          font-size: 8rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--error), #ff6666);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
        }
        
        h1 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        
        p {
          color: #999;
          margin-bottom: 2rem;
          font-size: 1.1rem;
        }
        
        .error-details {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 8px;
          padding: 1rem;
          margin: 2rem 0;
          text-align: left;
          font-family: "JetBrains Mono", "Consolas", monospace;
          font-size: 0.9rem;
          color: #ff6666;
          overflow-x: auto;
        }
        
        a {
          display: inline-block;
          padding: 0.75rem 2rem;
          background: var(--accent);
          color: var(--bg);
          text-decoration: none;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        a:hover {
          background: #00ffaa;
          transform: translateY(-2px);
        }
      </style>
    </head>
    <body>
      <div class="error-container">
        <div class="error-code">500</div>
        <h1>Server Error</h1>
        <p>Something went wrong while processing your request.</p>
        ${isDev ? `<div class="error-details">${errorMessage}</div>` : ""}
        <a href="/">Back to Documentation Hub</a>
      </div>
    </body>
    </html>
  `;

  return c.html(html, 500);
};
