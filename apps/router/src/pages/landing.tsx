import { Context } from "hono";
import { PROJECTS } from "../config/projects";
import type { Env } from "../env";

const styles = `
  :root {
    --bg: #0a0a0a;
    --fg: #ededed;
    --accent: #00d4ff;
    --card-bg: rgba(26, 26, 26, 0.5);
    --border: #2a2a2a;
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
    line-height: 1.6;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow-x: hidden;
  }
  
  body::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 1px 1px, rgba(0, 212, 255, 0.15) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    animation: drift-40 20s linear infinite;
  }
  
  body::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 1px 1px, rgba(0, 255, 170, 0.1) 1px, transparent 1px);
    background-size: 60px 60px;
    background-position: 30px 30px;
    pointer-events: none;
    animation: drift-60 30s linear infinite reverse;
  }
  
  @keyframes drift-40 {
    from {
      transform: translate(0, 0);
    }
    to {
      transform: translate(40px, 40px);
    }
  }
  
  @keyframes drift-60 {
    from {
      transform: translate(0, 0);
    }
    to {
      transform: translate(60px, 60px);
    }
  }
  
  .container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem;
    flex: 1;
    position: relative;
    z-index: 1;
  }
  
  header {
    margin-bottom: 3rem;
    text-align: center;
  }
  
  header:hover h1 {
    text-shadow: 
      0 0 35px rgba(0, 212, 255, 0.6),
      0 0 45px rgba(0, 255, 170, 0.8),
      0 0 55px rgba(0, 255, 170, 0.6),
      0 0 70px rgba(0, 212, 255, 0.4);
    animation-play-state: paused;
  }
  
  h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
    background: linear-gradient(110deg, var(--accent) 30%, #00ffaa 70%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: inline-block;
    text-shadow: 
      0 0 30px rgba(0, 212, 255, 0.3),
      0 0 40px rgba(0, 255, 170, 0.4),
      0 0 50px rgba(0, 255, 170, 0.3),
      0 0 60px rgba(0, 212, 255, 0.2);
    animation: pulse-glow 6s ease-in-out infinite;
    transition: text-shadow 0.3s ease;
    cursor: pointer;
  }
  
  h1:hover {
    text-shadow: 
      0 0 35px rgba(0, 212, 255, 0.6),
      0 0 45px rgba(0, 255, 170, 0.8),
      0 0 55px rgba(0, 255, 170, 0.6),
      0 0 70px rgba(0, 212, 255, 0.4);
    animation-play-state: paused;
  }
  
  @keyframes pulse-glow {
    0%, 100% {
      text-shadow: 
        0 0 30px rgba(0, 212, 255, 0.3),
        0 0 40px rgba(0, 255, 170, 0.4),
        0 0 50px rgba(0, 255, 170, 0.3),
        0 0 60px rgba(0, 212, 255, 0.2);
    }
    50% {
      text-shadow: 
        0 0 35px rgba(0, 212, 255, 0.4),
        0 0 45px rgba(0, 255, 170, 0.5),
        0 0 55px rgba(0, 255, 170, 0.4),
        0 0 65px rgba(0, 212, 255, 0.3);
    }
  }
  
  .subtitle {
    font-size: 1.25rem;
    color: #999;
  }
  
  .projects {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-top: 3rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .projects li {
    list-style: none;
    background: var(--card-bg);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 0;
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
                box-shadow 0.2s ease-out,
                border-color 0.2s ease-out;
    position: relative;
    overflow: hidden;
    box-shadow: 
      0 4px 6px rgba(0, 0, 0, 0.1),
      0 1px 3px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.03);
    will-change: transform;
  }
  
  .projects li::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(0, 212, 255, 0.05) 0%,
      transparent 40%,
      transparent 60%,
      rgba(0, 255, 170, 0.05) 100%
    );
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
  }
  
  .projects li:hover {
    transform: translateY(-2px);
    border-color: rgba(0, 212, 255, 0.3);
    box-shadow: 
      0 20px 40px rgba(0, 212, 255, 0.15),
      0 10px 20px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    cursor: pointer;
  }
  
  .projects li:hover::before {
    opacity: 1;
  }
  
  .projects li:hover h3 {
    color: #00ffaa;
  }
  
  .projects h3 {
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
  }
  
  .projects a {
    display: block;
    padding: 2rem;
    text-decoration: none;
    color: inherit;
    position: relative;
    z-index: 1;
  }
  
  .projects h3 {
    color: #d0d0d0;
    transition: color 0.2s ease;
  }
  
  .projects p {
    color: #999;
    font-size: 0.95rem;
  }
  
  footer {
    text-align: center;
    padding: 2rem;
    border-top: 1px solid var(--border);
    color: #666;
    font-size: 0.9rem;
  }
  
  footer a {
    color: var(--accent);
    text-decoration: none;
  }
  
  @media (max-width: 768px) {
    h1 {
      font-size: 2rem;
    }
    
    .container {
      padding: 1rem;
    }
    
    .projects {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }
`;

interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
}

const ProjectCard = ({ id, name, description }: ProjectCardProps) => (
  <li>
    <a href={`/${id}/`}>
      <h3>{name}</h3>
      <p>{description}</p>
    </a>
  </li>
);

const LandingPage = () => {
  const projects = Object.values(PROJECTS);

  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>docs.den.ai</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossorigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: styles }} />
      </head>
      <body>
        <div class="container">
          <header>
            <h1>docs.den.ai</h1>
          </header>

          <main>
            <ul class="projects">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  name={project.name}
                  description={project.description}
                />
              ))}
            </ul>
          </main>
        </div>
      </body>
    </html>
  );
};

export const handleLandingPage = (c: Context<{ Bindings: Env }>) => {
  return c.html(<LandingPage />);
};
