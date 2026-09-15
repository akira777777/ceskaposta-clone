import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: ['test.spec.js'],
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3002',
  },
  webServer: {
    command: 'node server.js',
    port: 3002,
    reuseExistingServer: true,
    timeout: 20000,
  },
});
