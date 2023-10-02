const jwt = require('jsonwebtoken');
const { getIDfromToken } = require('../../controllers/AuthController'); // Replace with the correct path to your module

// Mock req and res objects
const mockReq = {
  headers: {
    authorization: 'Bearer your-mocked-token',
  },
};

const mockRes = {
  json: jest.fn(),
};

// Mock jwt.verify function
jest.spyOn(jwt, 'verify').mockReturnValueOnce({ _id: 'mocked-user-id' });

// Test the getIDfromToken function
test('should respond with the decoded user id', () => {
  // Call the function with the mock req and res
  getIDfromToken(mockReq, mockRes, jest.fn());

  // Expectations
  expect(jwt.verify).toHaveBeenCalledWith('your-mocked-token', 'verySecretValue');
  expect(mockRes.json).toHaveBeenCalledWith({ id: 'mocked-user-id' });
});
