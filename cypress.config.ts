import { defineConfig } from 'cypress';

const isCI = process.env['CI'] === 'true';

export default defineConfig({
  e2e: {
    baseUrl: isCI
      ? 'https://unieventos-site-front.netlify.app'
      : 'http://localhost:4200',
    supportFile: false,
    specPattern: 'cypress/e2e/**/*.cy.ts'
  },
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'cypress/results/cypress-report.xml',
    toConsole: true
  }
});
