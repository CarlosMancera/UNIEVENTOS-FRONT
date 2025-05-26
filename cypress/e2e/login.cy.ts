describe('C1 - Login exitoso', () => {
  it('C1_should_login_successfully_and_logout', () => {
    cy.visit('/login');

    cy.get('input[name="email"]').type('ndortizp@uqvirtual.edu.co');
    cy.get('input[name="password"]').type('1234');
    cy.get('button.login-button').click();

    cy.contains('¡Bienvenido!').should('exist');

    cy.get('.user-icon.dropdown').should('contain.text', 'Admin Ortiz P').click();
    cy.contains('Cerrar sesión').click();

    cy.url().should('include', '/');
    cy.get('.user-icon a[routerlink="/login"]').should('exist');
  });
});
