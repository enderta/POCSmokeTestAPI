const { defineConfig } = require('cypress');
const fs = require('fs');

const { beforeRunHook, afterRunHook } = require('cypress-mochawesome-reporter/lib');

module.exports = defineConfig({
  experimentalMemoryManagement: true,
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'API Smoke Test',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
      e2e: {
        setupNodeEvents(on, config) {
          on('before:run', async (details) => {
            console.log('override before:run');
            await beforeRunHook(details);
          });

          on('after:run', async () => {
            console.log('override after:run');
            await afterRunHook();
          });
        },
      },


  env: (() => {
    const envPath = './cypress.env.json';
    if (fs.existsSync(envPath)) {
      return JSON.parse(fs.readFileSync(envPath));
    }
    return {};
  })(),
});
