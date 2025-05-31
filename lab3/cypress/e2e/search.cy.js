describe("Home Page and Search Functionality", () => {
  beforeEach(() => {
    cy.visit("localhost:5173/");
  });

  it("should load the home page and display books", () => {
    cy.get('input[placeholder="Szukaj książek..."]').should("be.visible");
    cy.contains("button", "Filtruj").should("be.visible");
    cy.get("main div.grid").children().should("have.length.greaterThan", 0);
  });

  it("should filter books based on search query", () => {
    const searchableTitle = "test";
    const otherTitle = "ksiazka";

    cy.get("main div.grid")
      .contains(searchableTitle, { matchCase: false })
      .should("be.visible");
    cy.get("main div.grid")
      .contains(otherTitle, { matchCase: false })
      .should("be.visible");

    cy.get('input[placeholder="Szukaj książek..."]').type(searchableTitle);

    cy.get("main div.grid")
      .contains(searchableTitle, { matchCase: false })
      .should("be.visible");

    cy.get("main div.grid")
      .contains(otherTitle, { matchCase: false })
      .should("not.exist");
  });

  it("should show no books for a non-matching search query", () => {
    const nonExistentQuery = "zzzzzzzzz";

    cy.get('input[placeholder="Szukaj książek..."]').type(nonExistentQuery);

    cy.get("main div.grid").children().should("have.length", 0);
  });
});
