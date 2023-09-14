const { register } = require('../your-controller-file'); // Replace with the actual path to your controller file
const Publisher = require('../your-publisher-model'); // Replace with the actual path to your Publisher model
const bcrypt = require('bcrypt');

// Mock the required functions and objects
jest.mock('../your-publisher-model');
jest.mock('bcrypt');

describe('Register API', () => {
  it('should register a new publisher when username is not taken', async () => {
    const req = {
      body: {
        name: 'Test User',
        email: 'test@example.com',
        phonenumber: '1234567890',
        username: 'testuser',
        password: 'testpassword',
        bio_data: 'Test bio data',
        year_stabilized: 2022,
      },
    };

    const res = {
      json: jest.fn(),
    };

    Publisher.findOne.mockResolvedValue(null);
    bcrypt.hash.mockImplementation((password, saltRounds, callback) => {
      callback(null, 'hashedPassword');
    });
    Publisher.prototype.save.mockResolvedValue({});

    await register(req, res);

    expect(Publisher.findOne).toHaveBeenCalledWith({ username: 'testuser' });
    expect(bcrypt.hash).toHaveBeenCalledWith('testpassword', 10, expect.any(Function));
    expect(Publisher.prototype.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      message: 'success',
    });
  });

  it('should return an error message when username is already taken', async () => {
    const req = {
      body: {
        username: 'existinguser',
        // ... other fields ...
      },
    };

    const res = {
      json: jest.fn(),
    };

    Publisher.findOne.mockResolvedValue({});

    await register(req, res);

    expect(Publisher.findOne).toHaveBeenCalledWith({ username: 'existinguser' });
    expect(res.json).toHaveBeenCalledWith({
      message: 'Publisher already exists.',
    });
  });

  it('should return an error message when an error occurs during registration', async () => {
    const req = {
      body: {
        // ... fields ...
      },
    };

    const res = {
      json: jest.fn(),
    };

    Publisher.findOne.mockRejectedValue(new Error('Database error'));

    await register(req, res);

    expect(Publisher.findOne).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      message: 'An error is occured.',
    });
  });
});
