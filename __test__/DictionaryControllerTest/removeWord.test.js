const { remove } = require("../../controllers/DictionaryController"); // Import the remove function
const Dictionary = require("../../models/Dictinary"); // Import your Dictionary model

jest.mock("../../models/Dictinary");

const req = {
  body: {
    _id: 1, // Replace with the desired word ID to be deleted
  },
};

const res = {
  json: jest.fn(),
};

describe("remove function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* This test is checking if the `remove` function successfully deletes a word from the dictionary. */
  test("remove function deletes a word successfully", async () => {
    // Mock the Dictionary.findByIdAndDelete function to resolve successfully
    Dictionary.findByIdAndDelete.mockResolvedValueOnce();

    await remove(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: "Word is deleted successfully." });
  });

  /* This test is for the scenario where the `remove` function encounters an error. */
  test("remove function encounters an error", async () => {
    // Mock the Dictionary.findByIdAndDelete function to reject with an error
    Dictionary.findByIdAndDelete.mockRejectedValueOnce(new Error("An error occurred"));

    await remove(req, res);

    expect(res.json).toHaveBeenCalledTimes(0);
  });
});
