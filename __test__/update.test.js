const { update } = require('../your-controller-file'); // Replace with the actual path to your controller file
const Publisher = require('../your-publisher-model'); // Replace with the actual path to your Publisher model
const bcrypt = require('bcrypt');

// Mock the required functions and objects
jest.mock('../your-publisher-model');
jest.mock('bcrypt');

describe('Update API', () => {
  it('should update publisher data with a new password', async () => {
    const req = {
      body: {
        _id: '12345', // Replace with a valid publisher ID
        name: 'Updated User',
        email: 'updated@example.com',
        phonenumber: '9876543210',
        username: 'updateduser',
        bio_data: 'Updated bio data',
        password: 'newpassword', // Provide a new password
        year_stabilized: 2023,
        logo: 'newlogo.jpg',
      },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    bcrypt.hash.mockImplementation((password, saltRounds, callback) => {
      callback(null, 'hashedPassword');
    });
    Publisher.findOneAndUpdate.mockResolvedValue({});

    await update(req, res);

    expect(Publisher.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: '12345' }, // Replace with the appropriate ID
      expect.objectContaining({
        name: 'Updated User',
        email: 'updated@example.com',
        phonenumber: '9876543210',
        username: 'updateduser',
        bio_data: 'Updated bio data',
        year_stabilized: 2023,
        logo: 'newlogo.jpg',
        password: 'hashedPassword', // Password should be hashed
      })
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Publisher data is updated successfully.',
    });
  });

  it('should update publisher data without changing the password', async () => {
    const req = {
      body: {
        _id: '12345', // Replace with a valid publisher ID
        name: 'Updated User',
        email: 'updated@example.com',
        phonenumber: '9876543210',
        username: 'updateduser',
        bio_data: 'Updated bio data',
        year_stabilized: 2023,
        logo: 'newlogo.jpg',
      },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    Publisher.findOneAndUpdate.mockResolvedValue({});

    await update(req, res);

    expect(Publisher.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: '12345' }, // Replace with the appropriate ID
      expect.objectContaining({
        name: 'Updated User',
        email: 'updated@example.com',
        phonenumber: '9876543210',
        username: 'updateduser',
        bio_data: 'Updated bio data',
        year_stabilized: 2023,
        logo: 'newlogo.jpg',
      })
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Publisher data is updated successfully.',
    });
  });

  it('should return an error message when an error occurs during update', async () => {
    const req = {
      body: {
        _id: '12345', // Replace with a valid publisher ID
        // ... other fields ...
      },
    };

    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    Publisher.findOneAndUpdate.mockRejectedValue(new Error('Database error'));

    await update(req, res);

    expect(Publisher.findOneAndUpdate).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'An error occurred.',
      error: 'Database error', // Include the error message for debugging
    });
  });
});
