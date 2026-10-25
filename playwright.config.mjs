import { defineConfig } from '@playwright/test'
import { existsSync } from 'node:fs'

export default defineConfig({
  testDir: './tests/browser',
  workers: 1,
  retries: 0,
  reporter: [['list'], ['html', { outputFolder: 'test-reports/browser', open: 'never' }], ['json', { outputFile: 'test-reports/results.json' }]],
  use: { baseURL: 'http://127.0.0.1:4173', headless: true, launchOptions: { executablePath: existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined }, trace: 'retain-on-failure' },
  webServer: { command: 'npm run serve:static', url: 'http://127.0.0.1:4173', reuseExistingServer: false },
})
