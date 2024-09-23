import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'npx nx run fsm-app:serve',
        production: 'npx nx run fsm-app:serve-static',
      },
      ciWebServerCommand: 'npx nx run fsm-app:serve-static',
      ciBaseUrl: 'http://localhost:4200',
    }),
    specPattern: 'apps/fsm-app-e2e/src/e2e/app.cy.ts',
    baseUrl: 'http://localhost:4200',
  },
});
