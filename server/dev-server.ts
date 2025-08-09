import express from 'express';
import { createServer } from 'http';
import { createServer as createViteServer } from 'vite';
import path from 'path';

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

async function startFormForgeServer() {
  try {
    console.log('🚀 Starting FormForge Development Server...');

    // Create Vite dev server with proper configuration
    const vite = await createViteServer({
      root: path.resolve(process.cwd(), 'client'),
      server: { 
        middlewareMode: true,
        fs: {
          strict: false,
          allow: ['..']
        }
      },
      resolve: {
        alias: {
          '@': path.resolve(process.cwd(), 'client', 'src'),
          '@shared': path.resolve(process.cwd(), 'shared'),
          '@assets': path.resolve(process.cwd(), 'attached_assets'),
        }
      },
      appType: 'spa',
      clearScreen: false
    });

    // Use Vite's connect instance as middleware
    app.use(vite.middlewares);

    // Error handling middleware
    app.use((err: any, req: any, res: any, next: any) => {
      console.error('❌ Server Error:', err.message);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    // Create HTTP server
    const server = createServer(app);

    const PORT = 3000;
    const HOST = 'localhost';

    server.listen(PORT, HOST, () => {
      console.log(`✅ FormForge Server running on http://${HOST}:${PORT}`);
      console.log(`📱 Open your browser and visit: http://${HOST}:${PORT}`);
      console.log(`🔄 Hot reload enabled - make changes and see them instantly!`);
    });

    // Handle server errors
    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Please stop other servers or use a different port.`);
      } else {
        console.error('❌ Server error:', err);
      }
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Failed to start FormForge server:', error);
    process.exit(1);
  }
}

// Handle process termination gracefully
process.on('SIGTERM', () => {
  console.log('👋 FormForge server shutting down...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 FormForge server shutting down...');
  process.exit(0);
});

startFormForgeServer();
