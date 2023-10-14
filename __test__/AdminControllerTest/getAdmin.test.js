const { getAdmin } = require("../../controllers/AdminController"); // Import the getAdmin function
const Admin = require("../../models/Admin"); // Import your Admin model

jest.mock("../../models/Admin");

const req = {
  body: {
    id: 1,
  },
};

const res = {
  json: jest.fn(),
  status: jest.fn(() => res),
};

describe("getAdmin function", () => {
  /* This test is checking if the `getAdmin` function is called successfully with a valid ID. */
  test("getAdmin function is called successfully with a valid ID", async () => {
    const mockAdminData = {
      _id: 1,
      name: "John Doe",
      // Add other admin fields as needed
    };

    Admin.findById.mockResolvedValueOnce(mockAdminData);

    await getAdmin(req, res);

    expect(res.json).toHaveBeenCalledWith(mockAdminData);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  /* This test is for the scenario where the `getAdmin` function is called unsuccessfully with an invalid ID. */
  test("getAdmin function is called unsuccessfully with an invalid ID", async () => {
    Admin.findById.mockResolvedValueOnce(null);

    await getAdmin(req, res);

    expect(res.json).toHaveBeenCalledWith({ success: false });
    expect(res.status).toHaveBeenCalledWith(500); // Assuming you return 500 for errors
  });
});
