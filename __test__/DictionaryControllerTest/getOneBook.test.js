const { getOne } = require("../../controllers/DictionaryController"); // Import the getOne function
const Dictionary = require("../../models/Dictinary"); // Import your Dictionary model

jest.mock("../../models/Dictinary");

const req = {
  body: {
    _id: 1, // Replace with the desired word ID to retrieve
  },
};

const res = {
  json: jest.fn(),
};

describe("getOne function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* This test is checking if the `getOne` function is called successfully. */
  test("getOne function is called successfully", async () => {
    const mockData = {
      word: "Word 1",
      meaning: "Meaning 1",
      example: "Example 1",
    };

    // Mock the Dictionary.findById function to resolve with mock data
    Dictionary.findById.mockResolvedValueOnce(mockData);

    await getOne(req, res);

    expect(res.json).toHaveBeenCalledWith({ data: mockData });
  });

  /* This test is for the scenario where the `getOne` function encounters an error. */
  test("getOne function encounters an error", async () => {
    // Mock the Dictionary.findById function to reject with an error
    Dictionary.findById.mockRejectedValueOnce(new Error("An error occurred"));

    await getOne(req, res);

    expect(res.json).toHaveBeenCalledTimes(0);
  });
});
