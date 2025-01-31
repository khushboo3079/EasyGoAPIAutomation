import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'D:/EasyGoAPIAutomation/TestCases', // Update to your test directory
  retries: 1, // Retry tests once if they fail
  reporter: [['list'], ['html']], // Generate HTML report
  use: {
    headless: true,
  },
});