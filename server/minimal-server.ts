import express from "express";
import { createServer } from "http";
import { createServer as createViteServer } from "vite";
import path from "path";

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.static(path.resolve(process.cwd(), "client", "public")));

async function startServer() {
  try {
    console.log("🚀 Starting FormForge server...");

    // Create Vite dev server
    const vite = await createViteServer({
      configFile: path.resolve(process.cwd(), "vite.config.ts"),
      server: { middlewareMode: true },
      appType: "custom",
      clearScreen: false
    });

    // Use Vite's connect instance as middleware
    app.use(vite.middlewares);

    const server = createServer(app);
    const port = 8080; // Use different port to avoid cache issues

    server.listen(port, "localhost", () => {
      console.log(`✅ Server running on http://localhost:${port}`);
      console.log(`📱 FormForge is ready!`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
