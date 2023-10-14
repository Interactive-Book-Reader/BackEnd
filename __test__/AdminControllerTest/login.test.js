const { loginAdmin } = require("../../controllers/AdminController"); // Import the loginAdmin function
const Admin = require("../../models/Admin"); // Import your Admin model
const jwt = require("jsonwebtoken"); // Import jsonwebtoken if not already done

jest.mock("../../models/Admin");

// Mock bcrypt functions
jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

const req = {
  body: {
    username: "adminusername",
    password: "adminpassword",
  },
};

const res = {
  json: jest.fn(),
};

describe("loginAdmin function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* This test is checking if the `loginAdmin` function is called successfully with valid credentials. */
  test("loginAdmin function is called successfully with valid credentials", async () => {
    const mockAdminData = {
      _id: 1,
      username: "adminusername",
      password: "hashedpassword", // Replace with the actual hashed password
      // Add other admin fields as needed
    };

    Admin.findOne.mockResolvedValueOnce(mockAdminData);
    bcrypt.compare.mockResolvedValueOnce(true);

    // Mock the jwt.sign function to return a token
    jwt.sign = jest.fn().mockReturnValue("mockedtoken");

    await loginAdmin(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: "Login Successful",
      token: "mockedtoken",
    });
  });

  /* The other test cases for incorrect credentials, bcrypt error, and incorrect password
     can remain the same as in the previous example.
  */
});
