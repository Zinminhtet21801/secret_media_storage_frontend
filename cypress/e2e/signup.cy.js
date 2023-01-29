import { faker } from "@faker-js/faker";

describe("Sign Up", async () => {
  const fullName = faker.name.fullName();
  const email = faker.internet.email();
  const password = faker.internet.password();
  beforeEach(() => {
    cy.visit("/");
  });

  // it("Page title should contain Vite App", async () => {
  //   cy.title().should("eq", "Vite App");
  //   cy.get("p.chakra-text").should(
  //     "contain.text",
  //     "Never burden your device's storage. Never be late for environmental care too. Keep track of your data. Store your everyting."
  //   );
  // });

  it("Sign Up", async () => {
    // cy.contains("Get started").click();
    cy.get('button[href="/signup"]').click();
    cy.url().should("contain", "/signup");
    cy.url().should("eq", "http://localhost:3000/signup");
    cy.get("#fullName").type(fullName);
    cy.get("#email").type(email);
    cy.get("#password").type(password);
    cy.get("#confirmPassword").type(password);
    cy.get(".css-owjkmg > .chakra-text").should("exist");
    cy.get('[type="submit"]').click();
  });
});
