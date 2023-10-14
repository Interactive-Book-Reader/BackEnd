const { getAll } = require("../../controllers/DictionaryController"); // Import the getAll function
const Dictionary = require("../../models/Dictinary"); // Import your Dictionary model

jest.mock("../../models/Dictinary");

const req = {
  body: {
    user_id: 1, // Replace with the desired user ID
  },
};

const res = {
  json: jest.fn(),
};

describe("getAll function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* This test is checking if the `getAll` function is called successfully. */
  test("getAll function is called successfully", async () => {
    const mockData = [
      { word: "Word 1", meaning: "Meaning 1", example: "Example 1" },
      { word: "Word 2", meaning: "Meaning 2", example: "Example 2" },
      // Add more dictionary entries for the user
    ];

    // Mock the Dictionary.find function to resolve with mock data
    Dictionary.find.mockResolvedValueOnce(mockData);

    await getAll(req, res);

    expect(res.json).toHaveBeenCalledWith({ data: mockData });
  });

  /* This test is for the scenario where the `getAll` function encounters an error. */
  test("getAll function encounters an error", async () => {
    // Mock the Dictionary.find function to reject with an error
    Dictionary.find.mockRejectedValueOnce(new Error("An error occurred"));

    await getAll(req, res);

    expect(res.json).toHaveBeenCalledTimes(0);
  });
});
