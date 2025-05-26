describe('C101 - Login exitoso', () => {
  it('C101_should_login_successfully', () => {
    cy.visit('/login');

    cy.get('input[name="email"]').type('nicolas95051195@gmail.com');
    cy.get('input[name="password"]').type('1234');

    cy.get('button.login-button').click();

    cy.contains('¡Bienvenido!').should('exist');
  });
});
