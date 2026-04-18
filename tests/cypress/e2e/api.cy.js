const apiUrl = Cypress.env('apiUrl') || 'http://localhost:3001';

describe('API Tests', () => {
  before(() => {
    cy.seedDatabase();
  });

  it('should login via API and get user data', () => {
    cy.request({
      method: 'POST',
      url: `${apiUrl}/login`,
      body: { username: 'Heath93', password: 's3cret' },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.user).to.have.property('username', 'Heath93');
    });
  });

  it('should get list of users', () => {
    cy.loginByApi('Heath93', 's3cret');

    cy.request(`${apiUrl}/users`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.results).to.be.an('array');
      expect(response.body.results.length).to.be.greaterThan(0);
    });
  });

  it('should create a transaction via API', () => {
    cy.loginByApi('Heath93', 's3cret');

    // Get a user to send the transaction to
    cy.request(`${apiUrl}/users`).then((usersResponse) => {
      const receiver = usersResponse.body.results[0];

      cy.request({
        method: 'POST',
        url: `${apiUrl}/transactions`,
        body: {
          transactionType: 'payment',
          receiverId: receiver.id,
          description: 'Cypress API test payment',
          amount: 1000,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.transaction).to.have.property('description', 'Cypress API test payment');
      });
    });
  });

  it('should get public transactions', () => {
    cy.loginByApi('Heath93', 's3cret');

    cy.request(`${apiUrl}/transactions/public`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.results).to.be.an('array');
    });
  });

  it('should get notifications', () => {
    cy.loginByApi('Heath93', 's3cret');

    cy.request(`${apiUrl}/notifications`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.results).to.be.an('array');
    });
  });
});
