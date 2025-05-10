// support/index.d.ts
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    saveLocalStorageGlobally(): void
    restoreLocalStorageGlobally(): void
    clearGlobalLocalStorage(): void
  }
}
