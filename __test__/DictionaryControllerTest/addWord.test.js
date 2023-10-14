const { add } = require("../../controllers/DictionaryController"); // Import the add function
const Dictionary = require("../../models/Dictinary"); // Import your Dictionary model

jest.mock("../../models/Dictinary");

const req = {
  body: {
    user_id: 1,       // Replace with the desired user ID
    word: "Example", // Replace with the desired word
    meaning: "Meaning of the word",
    example: "Example sentence",
  },
};

const res = {
  json: jest.fn(),
};

describe("add function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* This test is checking if the `add` function successfully adds a word to the dictionary. */
  test("add function adds a word successfully", async () => {
    // Mock Dictionary.findOne to resolve with no existing data
    Dictionary.findOne.mockResolvedValueOnce(null);

    // Mock the Dictionary.save function to resolve successfully
    Dictionary.prototype.save.mockResolvedValueOnce();

    await add(req, res);

    expect(res.json).toHaveBeenCalledTimes(0);
  });

  /* This test is for the scenario where the word already exists in the dictionary. */
  test("add function encounters an existing word", async () => {
    // Mock Dictionary.findOne to resolve with existing data
    Dictionary.findOne.mockResolvedValueOnce({ user_id: 1, word: "Example" });

    await add(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: "Word is already exist." });
  });

  /* This test is for the scenario where the `add` function encounters an error. */
  test("add function encounters an error", async () => {
    // Mock Dictionary.findOne to resolve with no existing data
    Dictionary.findOne.mockResolvedValueOnce(null);

    // Mock the Dictionary.save function to reject with an error
    Dictionary.prototype.save.mockRejectedValueOnce(new Error("An error occurred"));

    await add(req, res);

    expect(res.json).toHaveBeenCalledTimes(0);
  });
});
