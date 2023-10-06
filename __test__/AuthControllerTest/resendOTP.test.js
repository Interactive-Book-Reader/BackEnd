import { resendOTP } from '../../controllers/AuthController'; // Replace with the correct path to your module
// import { sendOTPVerification } from '../../controllers/AuthController';


import PublisherOTPVerification from '../../models/PublisherOTPVerification';
// Mock req and res objects
const mockReq = {
  body: {
    publisherId: 'mock-publisher-id',
    email: 'mock-email@example.com',
  },
};

const mockRes = {
  json: jest.fn(),
};

// // Mock PublisherOTPVerification model methods
// const mockDeleteMany = jest.fn(() => Promise.resolve());
// jest.mock('../../models/PublisherOTPVerification', () => {
//   return {
//     deleteMany: mockDeleteMany,
//   };
// });

// Mock sendOTPVerification function

jest.mock('../../controllers/AuthController', () => {
  
    sendOTPVerification: jest.fn(({_id,email},res) => Promise.resolve());
});

// Test the resendOTP function
// test('should resend OTP and respond with success', async () => {
//   await resendOTP(mockReq, mockRes);

//   // Expectations
//   PublisherOTPVerification.deleteMany.mockResolvedValueOnce();
   

// });

test('should respond with an error message when input is empty', async () => {
  // Modify the mock request to have empty input
  mockReq.body.publisherId = '';
  mockReq.body.email = '';

  await resendOTP(mockReq, mockRes);

  // Expectations
  expect(mockRes.json).toHaveBeenCalledWith({
    status: "Failed",
    message: "Invalid publisherId or email.",
  });
});
