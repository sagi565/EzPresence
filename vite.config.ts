import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import path from 'path'

/* Dev-only audio proxy — third-party CDNs (catbox.moe, etc.) don't send CORS
   headers, so the browser can't fetch + decodeAudioData them for waveform
   peaks. This middleware fetches the URL server-side and re-serves it with
   permissive CORS so the OfflineAudioContext can decode it.
   Production needs an equivalent backend endpoint; this only runs in dev. */
const audioProxyPlugin = (): Plugin => ({
  name: 'ezpresence-audio-proxy',
  configureServer(server) {
    // eslint-disable-next-line no-console
    console.log('[ezpresence-audio-proxy] mounted at /__audio-proxy');
    server.middlewares.use('/__audio-proxy', async (req, res) => {
      // eslint-disable-next-line no-console
      console.log('[ezpresence-audio-proxy] hit', req.method, req.url?.slice(0, 120));
      try {
        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', '*');
          res.end();
          return;
        }
        const target = new URL(req.url || '', 'http://x').searchParams.get('url');
        if (!target || !/^https?:\/\//i.test(target)) {
          res.statusCode = 400; res.end('missing or invalid url'); return;
        }
        const range = req.headers['range'];
        const upstream = await fetch(target, {
          headers: range ? { Range: String(range) } : undefined,
        });
        res.statusCode = upstream.status;
        res.setHeader('Access-Control-Allow-Origin', '*');
        for (const h of ['content-type', 'content-length', 'content-range', 'accept-ranges']) {
          const v = upstream.headers.get(h);
          if (v) res.setHeader(h, v);
        }
        if (!upstream.body) { res.end(); return; }
        const reader = upstream.body.getReader();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(Buffer.from(value));
        }
        res.end();
      } catch (e) {
        res.statusCode = 502;
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(String(e));
      }
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      basicSsl(),
      audioProxyPlugin(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@models': path.resolve(__dirname, './src/models'),
        '@auth': path.resolve(__dirname, './src/auth'),
        '@lib': path.resolve(__dirname, './src/lib'),
        '@theme': path.resolve(__dirname, './src/theme'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@context': path.resolve(__dirname, './src/context'),
      },
    },
    server: {
      https: {},
      port: Number(env.VITE_PORT) || 5173,
      host: '192.168.1.27',
      strictPort: true,
    },
  }
})