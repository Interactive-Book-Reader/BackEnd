const { register } = require("../../controllers/AuthController");
const Publisher = require("../../models/Publisher");

jest.mock("../../models/Publisher");

// Mock bcrypt.hash
jest.mock('bcrypt', () => {
    return {
      hash: jest.fn((password, salt, callback) => {
        if (password === 'validPassword') {
          callback(null, 'hashedPassword');
        } else {
          callback(new Error('Hashing failed'));
        }
      }),
    };
  });
  

test("alread exist publisher", async () => {
  const req = {
    body: {
      username: "test",
    },
  };
  const res = {
    json: jest.fn(),
  };
  Publisher.findOne.mockResolvedValueOnce(req.body);
  await register(req, res);
  expect(res.json).toHaveBeenCalledWith({
    message: "Publisher already exists.",
  });
});


// Mock Publisher model methods
const mockSave = jest.fn();
jest.mock('./Publisher', () => {
  return {
    create: jest.fn(() => ({
      save: mockSave,
    })),
  };
});

// Mock sendOTPVerification function
const mockSendOTPVerification = jest.fn();
jest.mock('./sendOTPVerificationModule', () => {
  return {
    sendOTPVerification: mockSendOTPVerification,
  };
});

// Mock Express response object
const mockRes = {
  json: jest.fn(),
};

describe('registerPublisher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should register a publisher and send OTP on success', async () => {
    const req = {
      body: {
        // Provide valid input data
      },
    };

    // Mock bcrypt.hash to succeed
    bcrypt.hash.mockImplementationOnce((password, salt, callback) => {
      callback(null, 'hashedPassword');
    });

    // Mock Publisher model save to succeed
    mockSave.mockResolvedValueOnce({});

    await registerPublisher(req, mockRes);

    expect(bcrypt.hash).toHaveBeenCalledWith(expect.any(String), 10, expect.any(Function));
    expect(mockSave).toHaveBeenCalledWith();
    expect(mockSendOTPVerification).toHaveBeenCalledWith({}, mockRes);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'success' }));
  });

  test('should respond with an error message on failure', async () => {
    const req = {
      body: {
        // Provide invalid input data
      },
    };

    // Mock bcrypt.hash to fail
    bcrypt.hash.mockImplementationOnce((password, salt, callback) => {
      callback(new Error('Hashing failed'));
    });

    await registerPublisher(req, mockRes);

    expect(bcrypt.hash).toHaveBeenCalledWith(expect.any(String), 10, expect.any(Function));
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'An error is occurred.' }));
  });
});



