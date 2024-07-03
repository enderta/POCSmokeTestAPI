const { defineConfig } = require('cypress');
const fs = require('fs');
<<<<<<< HEAD
const { beforeRunHook, afterRunHook } = require('cypress-mochawesome-reporter/lib');

module.exports = defineConfig({
  experimentalMemoryManagement: true,
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'custom-title',
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

=======

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },

  },
>>>>>>> 233bdbc53143875e363ff6a52111bbf060633f23
  env: (() => {
    const envPath = './cypress.env.json';
    if (fs.existsSync(envPath)) {
      return JSON.parse(fs.readFileSync(envPath));
    }
    return {};
  })(),
});
