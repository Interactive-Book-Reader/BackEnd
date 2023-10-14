const { show } = require("../../controllers/BookController"); // Import the show function
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

describe("show function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* This test is checking if the `show` function is called successfully with a book found. */
  test("show function is called successfully with a book found", async () => {
    const mockBook = { _id: 1, title: "Book 1", author: "Author 1" };

    // Mock the Book.findOne function to resolve with a mock book
    Book.findOne.mockResolvedValueOnce(mockBook);

    await show(req, res);

    expect(res.json).toHaveBeenCalledWith(mockBook);
  });

  /* This test is for the scenario where the `show` function is called unsuccessfully (book not found). */
  test("show function is called unsuccessfully (book not found)", async () => {
    // Mock the Book.findOne function to resolve with null (no book found)
    Book.findOne.mockResolvedValueOnce(null);

    await show(req, res);

    expect(res.json).toHaveBeenCalledWith(null); // Check for null response
  });

  /* This test is for the scenario where the `show` function encounters an error. */
  test("show function encounters an error", async () => {
    // Mock the Book.findOne function to reject with an error
    Book.findOne.mockRejectedValueOnce(new Error("An error occurred"));

    await show(req, res);

    expect(res.json).toHaveBeenCalledTimes(0);
  });
});
