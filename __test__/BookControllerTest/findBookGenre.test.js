const { findBookByGenre } = require("../../controllers/BookController"); // Import the findBookByGenre function
const Book = require("../../models/Book"); // Import your Book model

jest.mock("../../models/Book");

const req = {
  body: {
    genre: "Mystery", // Replace with the desired genre
  },
};

const res = {
  json: jest.fn(),
};

describe("findBookByGenre function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* This test is checking if the `findBookByGenre` function is called successfully. */
  test("findBookByGenre function is called successfully", async () => {
    const mockBooks = [
      { title: "Book 1", genre: "Mystery" },
      { title: "Book 2", genre: "Mystery" },
      // Add more book objects with the same genre
    ];

    // Mock the Book.find function to resolve with mock books
    Book.find.mockResolvedValueOnce(mockBooks);

    await findBookByGenre(req, res);

    expect(res.json).toHaveBeenCalledWith({ response: mockBooks });
  });

  /* This test is for the scenario where the `findBookByGenre` function encounters an error. */
  test("findBookByGenre function encounters an error", async () => {
    // Mock the Book.find function to reject with an error
    Book.find.mockRejectedValueOnce(new Error("An error occurred"));

    await findBookByGenre(req, res);

    expect(res.json).toHaveBeenCalledTimes(0);
  });
});
