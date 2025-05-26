describe('C1 - Login exitoso', () => {
  it('C1_should_login_successfully', () => {
    cy.visit('/login');

    cy.get('input[name="email"]').type('ndortizp@uqvirtual.edu.co');
    cy.get('input[name="password"]').type('1234');

    cy.get('button.login-button').click();

    cy.contains('¡Bienvenido!').should('exist');
  });
});
