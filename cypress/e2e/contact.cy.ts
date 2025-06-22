describe('Contact Test', () => {
  beforeEach(() => {
  })
  
  it('visits the app root url', () => {
    cy.visit('/')
    cy.get('.nav-links > :nth-child(3)').click();
    cy.get('#name').clear();
    cy.get('#name').type('TEST TARO');
    cy.get('#email').clear();
    cy.get('#email').type('wakyaroya@cocoro.uk');
    cy.get('#subject').clear();
    cy.get('#subject').type('TEST 件名');
    cy.get('#message').click();
    cy.get('#message').type('こんにちは');
    cy.get('#message').type('{Enter}');
    cy.get('#message').type('テストです');
    cy.get('#message').type('{Enter}');
    cy.get('#message').type('TEST');
    cy.get('.submit-button').click();
    cy.get('.success-message', { timeout: 20000 }).should('be.visible')
  })
})
