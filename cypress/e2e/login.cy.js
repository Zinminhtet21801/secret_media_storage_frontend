import { faker } from "@faker-js/faker";

describe("Login", async () => {
  const fullName = faker.name.fullName();
  const email = faker.internet.email();
  const password = faker.internet.password();
  beforeEach(() => {
    cy.visit("/");
  });

  it("Login", async () => {
    cy.get('button[href="/signup"]').click();
    cy.url().should("contain", "/signup");
    cy.url().should("eq", "http://localhost:3000/signup");
    cy.get(".chakra-text > a")
      .should("exist")
      .should("contain.text", "Login")
      .click();
    cy.get("#email").type("testing@gmail.com");
    cy.get("#password").type("Pass3");
    cy.get('[type="submit"]').click();
    cy.get('#menu-button-\:r7\:').should('exist')
  });
});
