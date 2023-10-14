const { index } = require("../../controllers/BookController"); // Import the index function
const Book = require("../../models/Book"); // Import your Book model

jest.mock("../../models/Book");

const req = {};
const res = {
  json: jest.fn(),
};

describe("index function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* This test is checking if the `index` function is called successfully with book data. */
  test("index function is called successfully with book data", async () => {
    const mockBooks = [
      { title: "Book 1", author: "Author 1" },
      { title: "Book 2", author: "Author 2" },
      // Add more book objects as needed
    ];

    // Mock the Book.find function to resolve with mockBooks
    Book.find.mockResolvedValueOnce(mockBooks);

    await index(req, res);

    expect(res.json).toHaveBeenCalledWith({ response: mockBooks });
  });

  /* This test is for the scenario where the `index` function is called unsuccessfully. */
  test("index function is called unsuccessfully", async () => {
    // Mock the Book.find function to reject with an error
    Book.find.mockRejectedValueOnce(new Error("An error occurred"));

    await index(req, res);

    expect(res.json).toHaveBeenCalledTimes(0);
  });
});
