const { getUser } = require("../../controllers/UserController"); // Import the getUser function
const User = require("../../models/User"); // Import your User model

jest.mock("../../models/User");

const req = {
  body: {
    id: 1, // Replace with the desired user ID
  },
};

const res = {
  json: jest.fn(),
};

describe("getUser function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* This test is checking if the `getUser` function is called successfully. */
  test("getUser function is called successfully", async () => {
    const mockUserData = {
      _id: 1,
      username: "testUser",
      // Add more user data fields
    };

    // Mock the User.find function to resolve with mock user data
    User.find.mockResolvedValueOnce([mockUserData]);

    await getUser(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: "User data is fetched successfully.",
      user: [mockUserData],
    });
  });

  /* This test is for the scenario where the `getUser` function encounters an error. */
  test("getUser function encounters an error", async () => {
    // Mock the User.find function to reject with an error
    User.find.mockRejectedValueOnce(new Error("An error occurred"));

    await getUser(req, res);

    expect(res.json).toHaveBeenCalledTimes(0);
  });
});
