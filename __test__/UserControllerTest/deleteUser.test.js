const { deleteUser } = require("../../controllers/UserController"); // Import the deleteUser function
const User = require("../../models/User"); // Import your User model

jest.mock("../../models/User");

const req = {
  body: {
    username: "testUser", // Replace with the desired username
  },
};

const res = {
  json: jest.fn(),
};

describe("deleteUser function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* This test is checking if the `deleteUser` function is called successfully. */
  test("deleteUser function is called successfully", async () => {
    // Mock the User.findOneAndDelete function to resolve successfully
    User.findOneAndDelete.mockResolvedValueOnce({});

    await deleteUser(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: "User is deleted successfully.",
    });
  });

  /* This test is for the scenario where the `deleteUser` function encounters an error. */
  test("deleteUser function encounters an error", async () => {
    // Mock the User.findOneAndDelete function to reject with an error
    User.findOneAndDelete.mockRejectedValueOnce(new Error("An error occurred"));

    await deleteUser(req, res);

    expect(res.json).toHaveBeenCalledTimes(0);
  });
});
