const { destroy } = require("../../controllers/BookController"); // Import the destroy function
const Book = require("../../models/Book"); // Import your Book model

jest.mock("../../models/Book");

const req = {
  body: {
    id: 1, // Replace with the desired book ID
  },
};

const res = {
  json: jest.fn(),
};

describe("destroy function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* This test is checking if the `destroy` function is called successfully. */
  test("destroy function is called successfully", async () => {
    // Mock the Book.findOneAndRemove function to resolve successfully
    Book.findOneAndRemove.mockResolvedValueOnce({});

    await destroy(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: "Book is deleted successfully!" });
  });

  /* This test is for the scenario where the `destroy` function encounters an error. */
  test("destroy function encounters an error", async () => {
    // Mock the Book.findOneAndRemove function to reject with an error
    Book.findOneAndRemove.mockRejectedValueOnce(new Error("An error occurred"));

    await destroy(req, res);

    expect(res.json).toHaveBeenCalledTimes(0);
  });
});
