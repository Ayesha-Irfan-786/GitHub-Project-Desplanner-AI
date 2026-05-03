import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();

  // ✅ IMPORTANT: Cloud Run uses process.env.PORT
  const PORT = process.env.PORT || 8080;

  app.use(express.json());

  // GitHub Repos API
  app.get("/api/github/repos/:username", async (req, res) => {
    try {
      const { username } = req.params;

      const response = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "GitHub-Project-Desplanner-AI",
          },
        }
      );

      if (!response.ok) {
        return res
          .status(response.status)
          .json({ error: "Failed to fetch repositories" });
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching repos:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // GitHub README API
  app.get("/api/github/readme/:owner/:repo", async (req, res) => {
    try {
      const { owner, repo } = req.params;

      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/readme`,
        {
          headers: {
            Accept: "application/vnd.github.v3.raw",
            "User-Agent": "GitHub-Project-Desplanner-AI",
          },
        }
      );

      if (!response.ok) {
        return res.json({ content: "No README found." });
      }

      const content = await response.text();
      res.json({ content });
    } catch (error) {
      console.error("Error fetching readme:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ✅ Vite / Production handling
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");

    app.use(express.static(distPath));

    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // ✅ MUST listen on 0.0.0.0 for Cloud Run
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
