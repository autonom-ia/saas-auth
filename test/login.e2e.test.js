const { login } = require('../src/handler/authHandler');

describe('Login Lambda Function E2E Tests', () => {
  it('should successfully login with valid credentials', async () => {
    const testCredentials = {
      email: 'test@example.com',
      password: 'test123'
    };
    console.log('Testing login with credentials:', testCredentials);

    const event = {
      body: JSON.stringify(testCredentials)
    };

    const response = await login(event);
    console.log('Login response:', JSON.stringify(response, null, 2));
    
    expect(response.statusCode).toBe(200);
    
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('token');
    expect(body).toHaveProperty('user');
    expect(body.user).toHaveProperty('email', testCredentials.email);
  });

  it('should fail with invalid credentials', async () => {
    const testCredentials = {
      email: 'test@example.com',
      password: 'wrongpassword'
    };

    const event = {
      body: JSON.stringify(testCredentials)
    };

    const response = await login(event);
    expect(response.statusCode).toBe(401);
    
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('error', 'Invalid credentials');
  });

  it('should fail with missing credentials', async () => {
    const testCredentials = {
      email: 'test@example.com'
      // missing password
    };

    const event = {
      body: JSON.stringify(testCredentials)
    };

    const response = await login(event);
    expect(response.statusCode).toBe(400);
    
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('error', 'Email and password are required');
  });
});
