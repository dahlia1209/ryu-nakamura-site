import { deleteUser, cyGetAccessToken } from '../support/helper'

describe('Registarion Test', () => {
  beforeEach(() => {})

  after('post', () => {
    cyGetAccessToken().then((output) => {
      deleteUser(output, Cypress.env('aad_id')).then(() => {})
    })
  })

  it('Registarion', () => {
    cy.visit('/')
    cy.get('.login-button').click()
    cy.url({ timeout: 10000 }).should('not.eq', Cypress.config().baseUrl + '/')
    cy.origin('https://ryun.ciamlogin.com', () => {})
    cy.log('新規会員登録')
    cy.log(Cypress.env('aad_username'), Cypress.env('aad_password'))
    cy.pause()
    cy.url({ timeout: 30000 }).should('eq', Cypress.config().baseUrl + '/?registration=completed')
  })

  it('sign in', () => {
    cy.visit('/')
    cy.get('.login-button').click()
    cy.url({ timeout: 10000 }).should('not.eq', Cypress.config().baseUrl + '/')
    cy.origin('https://ryun.ciamlogin.com', () => {})
    cy.log('サインイン')
    cy.log(Cypress.env('aad_username'), Cypress.env('aad_password'))
    cy.pause()
    cy.url({ timeout: 30000 }).should('eq', Cypress.config().baseUrl + '/')
  })

  
})
