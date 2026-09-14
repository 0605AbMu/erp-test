import { createApp } from '../apps/api/dist/main.js';

let appPromise;

const SWAGGER_CDN = {
  'swagger-ui.css': 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css',
  'swagger-ui-bundle.js': 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.js',
  'swagger-ui-standalone-preset.js': 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.js',
  'favicon-32x32.png': 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/favicon-32x32.png',
  'favicon-16x16.png': 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/favicon-16x16.png',
};

export default async function handler(request, response) {
  if (request.url) {
    for (const [file, cdnUrl] of Object.entries(SWAGGER_CDN)) {
      if (request.url.includes(file)) {
        response.writeHead(302, { Location: cdnUrl });
        return response.end();
      }
    }

    if (request.url.startsWith('/api/')) {
      request.url = request.url.slice(4);
    } else if (request.url === '/api') {
      request.url = '/';
    }
  }

  appPromise ??= createApp();
  const app = await appPromise;
  const expressApp = app.getHttpAdapter().getInstance();

  return expressApp(request, response);
}

