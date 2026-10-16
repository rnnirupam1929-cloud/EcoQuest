import { defineConfig } from 'vite'
import path from 'path'
import { readdir, readFile } from 'node:fs/promises'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

function ecoquestDigitalTwinPlugin() {
  const mapRoot = path.resolve(__dirname, 'EcoQuest Smart Waste App/public/mem2')

  return {
    name: 'ecoquest-digital-twin',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const requestUrl = new URL(req.url || '/', 'http://localhost')
        if (!requestUrl.pathname.startsWith('/mem2/')) return next()

        let filePath: string
        try {
          filePath = path.resolve(
            mapRoot,
            decodeURIComponent(requestUrl.pathname.slice('/mem2/'.length)),
          )
        } catch (error) {
          return next(error)
        }

        if (!filePath.startsWith(`${mapRoot}${path.sep}`)) {
          return next(new Error('Invalid Digital Twin asset path'))
        }

        try {
          const content = await readFile(filePath)
          const contentTypes: Record<string, string> = {
            '.css': 'text/css',
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.json': 'application/json',
            '.png': 'image/png',
            '.svg': 'image/svg+xml',
          }
          const contentType = contentTypes[path.extname(filePath)]
          if (contentType) res.setHeader('Content-Type', contentType)
          res.end(content)
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code === 'ENOENT') return next()
          console.error('Failed to serve Digital Twin asset:', error)
          return next(error)
        }
      })
    },
    async generateBundle(this: any) {
      const emitDirectory = async (sourceDirectory: string, outputDirectory: string) => {
        const entries = await readdir(sourceDirectory, { withFileTypes: true })
        for (const entry of entries) {
          const sourcePath = path.join(sourceDirectory, entry.name)
          const outputPath = path.posix.join(outputDirectory, entry.name)
          if (entry.isDirectory()) {
            await emitDirectory(sourcePath, outputPath)
          } else {
            this.emitFile({
              type: 'asset',
              fileName: outputPath,
              source: await readFile(sourcePath),
            })
          }
        }
      }

      await emitDirectory(mapRoot, 'mem2')
    },
  }
}

function ecoquestApiPlugin() {
  return {
    name: 'ecoquest-api-plugin',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const url = req.url || '';
        if (!url.startsWith('/api/rewards') && !url.startsWith('/api/user')) {
          return next();
        }

        try {
          const { createRequire } = await import('module');
          const require = createRequire(import.meta.url);
          const rewardService = require('./server/rewardService.js');

          const sendJson = (data: any, status = 200) => {
            res.statusCode = status;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          };

          // GET /api/rewards
          if (req.method === 'GET' && (url === '/api/rewards' || url.startsWith('/api/rewards?'))) {
            return sendJson({ ok: true, rewards: rewardService.getRewards() });
          }

          // GET /api/rewards/user/:userId
          if (req.method === 'GET' && url.startsWith('/api/rewards/user/')) {
            const userId = decodeURIComponent(url.replace('/api/rewards/user/', '').split('?')[0]);
            return sendJson({ ok: true, claims: rewardService.getUserClaims(userId) });
          }

          // GET /api/user/:userId
          if (req.method === 'GET' && url.startsWith('/api/user/')) {
            const userId = decodeURIComponent(url.replace('/api/user/', '').split('?')[0]);
            const user = rewardService.getUser(userId);
            const claims = rewardService.getUserClaims(userId);
            return sendJson({ ok: true, user, claims });
          }

          // POST requests
          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk: any) => { body += chunk; });
            req.on('end', () => {
              try {
                const parsed = body ? JSON.parse(body) : {};

                // POST /api/rewards/redeem
                if (url.startsWith('/api/rewards/redeem')) {
                  const result = rewardService.redeemReward(parsed.userId, parsed.claimId);
                  return sendJson(result, result.status || (result.ok ? 200 : 400));
                }

                // POST /api/rewards/claim
                if (url.startsWith('/api/rewards/claim')) {
                  const result = rewardService.claimReward(parsed.userId, parsed.rewardId, parsed.points);
                  return sendJson(result, result.status || (result.ok ? 200 : 400));
                }

                // POST /api/user/sync
                if (url.startsWith('/api/user/sync')) {
                  const updatedUser = rewardService.syncUserProgress(parsed.userId, parsed);
                  return sendJson({ ok: true, user: updatedUser });
                }

                return next();
              } catch (parseErr: any) {
                return sendJson({ ok: false, error: parseErr.message }, 400);
              }
            });
            return;
          }

          return next();
        } catch (err: any) {
          console.error('EcoQuest API middleware error:', err);
          return next();
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    ecoquestDigitalTwinPlugin(),
    ecoquestApiPlugin(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
  server: {
    watch: {
      ignored: ['**/Backend/**', '**/server/data/**'],
    },
    proxy: {
      // Proxy frontend requests during development to the news API & standalone backend
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
