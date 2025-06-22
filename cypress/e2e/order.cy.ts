import {
  deleteUser,
  cyGetAccessToken,
  createUser,
  getOrder,
  deleteOrder,
  getUser,
} from '../support/helper'

describe('Order Test', () => {
  //   it('pre', () => {
  //     cyGetAccessToken().then((output) => {
  //       createUser(output, Cypress.env('aad_id'),'local',Cypress.env('aad_username')).then(() => {})
  //     })
  //   })

  after('post', () => {
    cyGetAccessToken().then((output) => {
      getOrder(output, Cypress.env('aad_id')).then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          data.forEach(order => {
            deleteOrder(output, order.id)
          });
        }
      })
      getUser(output, Cypress.env('aad_id')).then((data) => {
        if (data && data.id == Cypress.env('aad_id')) {
          deleteUser(output, Cypress.env('aad_id')).then(() => {})
        }
      })
    })
  })

  it('purchase order', () => {
    cy.visit('/')
    cy.get('.login-button').click()
    cy.url({ timeout: 10000 }).should('not.eq', Cypress.config().baseUrl + '/')
    cy.origin('https://ryun.ciamlogin.com', () => {})
    cy.log('新規会員登録')
    cy.log(Cypress.env('aad_username'), Cypress.env('aad_password'))
    cy.pause()
    cy.get('.nav-links > :nth-child(1)').click()
    cy.get(':nth-child(3) > .content-info > .action-buttons > .details-button').click()
    cy.get('.price-badge').click()
    cy.get('.purchase-button').click()
    cy.origin('https://checkout.stripe.com', () => {
      cy.on('uncaught:exception', () => false) // 全てのエラーを無視
    })
    cy.pause()
    cy.url({ timeout: 30000 }).should('include', '?purchased=completed')
    cy.get('.account-icon').click();
    cy.get('.dropdown-menu > :nth-child(1)').click();
    cy.get('.details-button').click();
  })
})
