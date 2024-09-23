describe('FSM library E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/');
  });

  it('should update the current state on next state click', () => {
    cy.log('**Step #01: Initial state should be idle**');
    cy.get('.state-box.state-idle').should('exist');
    cy.get('li.active-state', { timeout: 10000 }).as('active-node1');
    cy.get('@active-node1').should('be.visible').should('contain', 'Idle');
    cy.wait(2000); // for demo purposes

    cy.log('**Step #02: Switch to loading state**');
    cy.get('.state-item.state-loading').should('exist').click();
    cy.get('li.active-state', { timeout: 10000 }).should('contain', 'Loading');
    cy.wait(2000); // for demo purposes

    cy.log('**step #03: Switch to success state**');
    cy.get('.state-item.state-success').should('exist').click();
    cy.get('li.active-state', { timeout: 10000 }).should('contain', 'Success');
    cy.wait(2000); // for demo purposes

    cy.log('**step #04: Switch to idle state**');
    cy.get('.state-item.state-idle').should('exist').click();
    cy.get('li.active-state', { timeout: 10000 }).should('contain', 'Idle');
    cy.wait(2000); // for demo purposes
  });
});
