const { defineConfig } = require('cypress');
const fs = require('fs');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
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
