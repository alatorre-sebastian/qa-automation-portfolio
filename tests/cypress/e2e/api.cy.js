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

  it('should search for users', () => {
    cy.loginByApi('Heath93', 's3cret');

    cy.request(`${apiUrl}/users/search?q=Heath`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.results).to.be.an('array');
    });
  });

  it('should get user profile by username', () => {
    cy.request(`${apiUrl}/users/profile/Heath93`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.user).to.have.property('firstName');
    });
  });

  it('should create and get a bank account', () => {
    cy.loginByApi('Heath93', 's3cret');

    cy.request({
      method: 'POST',
      url: `${apiUrl}/bankAccounts`,
      body: {
        bankName: 'Cypress API Bank',
        accountNumber: '123456789',
        routingNumber: '987654321',
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.account).to.have.property('bankName', 'Cypress API Bank');
    });
  });

  it('should delete a bank account', () => {
    cy.loginByApi('Heath93', 's3cret');

    // Create a bank account first
    cy.request({
      method: 'POST',
      url: `${apiUrl}/bankAccounts`,
      body: {
        bankName: 'Bank To Delete',
        accountNumber: '111222333',
        routingNumber: '444555666',
      },
    }).then((createResponse) => {
      const bankAccountId = createResponse.body.account.id;

      cy.request({
        method: 'DELETE',
        url: `${apiUrl}/bankAccounts/${bankAccountId}`,
      }).then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(200);
      });
    });
  });

  it('should like a transaction', () => {
    cy.loginByApi('Heath93', 's3cret');

    // Get a public transaction to like
    cy.request(`${apiUrl}/transactions/public`).then((txResponse) => {
      expect(txResponse.body.results.length).to.be.greaterThan(0);
      const transactionId = txResponse.body.results[0].id;

      cy.request({
        method: 'POST',
        url: `${apiUrl}/likes/${transactionId}`,
      }).then((likeResponse) => {
        expect(likeResponse.status).to.eq(200);
      });
    });
  });

  it('should comment on a transaction', () => {
    cy.loginByApi('Heath93', 's3cret');

    // Get a public transaction to comment on
    cy.request(`${apiUrl}/transactions/public`).then((txResponse) => {
      expect(txResponse.body.results.length).to.be.greaterThan(0);
      const transactionId = txResponse.body.results[0].id;

      cy.request({
        method: 'POST',
        url: `${apiUrl}/comments/${transactionId}`,
        body: { content: 'Cypress API test comment' },
      }).then((commentResponse) => {
        expect(commentResponse.status).to.eq(200);
      });
    });
  });

  it('should get contacts', () => {
    cy.loginByApi('Heath93', 's3cret');

    cy.request(`${apiUrl}/contacts/Heath93`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.contacts).to.be.an('array');
    });
  });

  it('should update user settings', () => {
    cy.loginByApi('Heath93', 's3cret');

    // Get the user ID from login
    cy.request({
      method: 'POST',
      url: `${apiUrl}/login`,
      body: { username: 'Heath93', password: 's3cret' },
    }).then((loginResponse) => {
      const userId = loginResponse.body.user.id;

      cy.request({
        method: 'PATCH',
        url: `${apiUrl}/users/${userId}`,
        body: {
          firstName: 'CypressFirst',
          lastName: 'CypressLast',
          email: 'cypress@test.com',
          phoneNumber: '555-000-2222',
        },
      }).then((updateResponse) => {
        expect(updateResponse.status).to.eq(204);
      });
    });
  });
});
