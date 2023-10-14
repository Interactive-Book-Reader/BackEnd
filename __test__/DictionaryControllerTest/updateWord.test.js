const { update } = require("../../controllers/DictionaryController"); // Import the update function
const Dictionary = require("../../models/Dictinary"); // Import your Dictionary model

jest.mock("../../models/Dictinary");

const req = {
  body: {
    _id: 1,             // Replace with the desired word ID
    word: "UpdatedWord", // Replace with the updated word
    meaning: "Updated meaning",
    example: "Updated example sentence",
  },
};

const res = {
  json: jest.fn(),
};

describe("update function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* This test is checking if the `update` function successfully updates a word in the dictionary. */
  test("update function updates a word successfully", async () => {
    // Mock the Dictionary.findOneAndUpdate function to resolve successfully
    Dictionary.findOneAndUpdate.mockResolvedValueOnce();

    await update(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: "Word is updated successfully." });
  });

  /* This test is for the scenario where the `update` function encounters an error. */
  test("update function encounters an error", async () => {
    // Mock the Dictionary.findOneAndUpdate function to reject with an error
    Dictionary.findOneAndUpdate.mockRejectedValueOnce(new Error("An error occurred"));

    await update(req, res);

    expect(res.json).toHaveBeenCalledTimes(0);
  });
});
