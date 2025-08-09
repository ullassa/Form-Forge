import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const vite = await createViteServer({
    root: path.resolve(import.meta.dirname, "..", "client"),
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "..", "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "..", "shared"),
      },
    },
    server: {
      middlewareMode: true,
      hmr: { server },
      fs: {
        strict: false,
        allow: [".."],
      },
    },
    appType: "spa",
  });

  app.use(vite.middlewares);
  
  // Handle SPA routing - serve index.html for non-API routes
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    
    // Skip for API routes and assets
    if (url.startsWith("/api") || url.includes(".") || url.startsWith("/@")) {
      return next();
    }

    try {
      const template = await fs.promises.readFile(
        path.resolve(import.meta.dirname, "..", "client", "index.html"),
        "utf-8"
      );
      const html = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      console.error("Error serving HTML:", e);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  console.log(`Looking for static files at: ${distPath}`);
  
  if (!fs.existsSync(distPath)) {
    console.error(`Could not find the build directory: ${distPath}`);
    console.log(`Current directory: ${import.meta.dirname}`);
    console.log(`Directory contents:`, fs.readdirSync(import.meta.dirname));
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  console.log(`Serving static files from: ${distPath}`);
  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    console.log(`Serving index.html from: ${indexPath}`);
    res.sendFile(indexPath);
  });
}
