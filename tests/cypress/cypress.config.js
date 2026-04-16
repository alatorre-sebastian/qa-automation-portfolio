const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    defaultCommandTimeout: 10000,
    video: true,
    screenshotOnRunFailure: true,
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'reports',
      overwrite: false,
      html: true,
      json: true,
    },
    supportFile: 'support/e2e.js',
    specPattern: 'e2e/**/*.cy.js',
    fixturesFolder: 'fixtures',
  },
});
