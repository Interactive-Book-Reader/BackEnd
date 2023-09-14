const request = require('supertest');
const app = require('../controllers/AuthController'); // Replace with the path to your Express app file

describe('Login API', () => {
  it('should return a success message and token on successful login', async () => {
    const response = await request(app)
      .post('/api/publisher/login')
      .send({
        username: 'testuser', // Replace with a valid username
        password: 'testpassword', // Replace with a valid password
        email: 'test@example.com', // Replace with a valid email
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login Successful');
    expect(typeof response.body.token).toBe('string');
  });

  it('should return an error message on incorrect password', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        username: 'testuser', // Replace with a valid username
        password: 'wrongpassword', // Provide an incorrect password
        email: 'test@example.com', // Replace with a valid email
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Password does not matched!');
  });

  it('should return an error message when no publisher is found', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        username: 'nonexistentuser', // Provide a non-existent username
        password: 'testpassword', // Replace with a valid password
        email: 'test@example.com', // Replace with a valid email
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('No publisher found!');
  });

  // Add more test cases as needed
});
