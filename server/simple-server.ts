import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { createServer as createViteServer } from "vite";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Basic logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Create HTTP server
const server = createServer(app);

async function startServer() {
  try {
    console.log("Starting server...");

    // Error handling middleware
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      console.error("Error:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    if (process.env.NODE_ENV === "development") {
      console.log("Setting up Vite development server...");
      
      // Create Vite server
      const vite = await createViteServer({
        configFile: path.resolve(process.cwd(), "vite.config.ts"),
        server: { middlewareMode: true },
        appType: "custom"
      });

      // Use Vite middleware
      app.use(vite.middlewares);

      // Catch-all handler for SPA
      app.use("*", async (req, res, next) => {
        const url = req.originalUrl;
        
        // Skip API routes and assets
        if (url.startsWith("/api") || 
            url.startsWith("/assets") || 
            url.startsWith("/src") ||
            url.startsWith("/@") ||
            url.includes(".")) {
          return next();
        }

        try {
          // Read index.html
          const template = path.resolve(process.cwd(), "client", "index.html");
          let html = require("fs").readFileSync(template, "utf-8");
          
          // Transform HTML with Vite
          html = await vite.transformIndexHtml(url, html);
          
          res.status(200).set({ "Content-Type": "text/html" }).end(html);
        } catch (e) {
          console.error("HTML serving error:", e);
          vite?.ssrFixStacktrace?.(e as Error);
          next(e);
        }
      });

      console.log("Vite setup completed");
    }

    const port = parseInt(process.env.PORT || "5000", 10);
    const host = process.env.HOST || "localhost";

    server.listen(port, host, () => {
      console.log(`✅ Server running on http://${host}:${port}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
