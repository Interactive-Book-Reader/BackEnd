const { findPriceRangeBook } = require("../../controllers/BookController"); // Import the findPriceRangeBook function
const Book = require("../../models/Book"); // Import your Book model

jest.mock("../../models/Book");

const req = {
  body: {
    starting_Price: 10, // Replace with the desired starting price
    ending_Price: 20,   // Replace with the desired ending price
  },
};

const res = {
  json: jest.fn(),
};

describe("findPriceRangeBook function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* This test is checking if the `findPriceRangeBook` function is called successfully. */
  test("findPriceRangeBook function is called successfully", async () => {
    const mockBooks = [
      { title: "Book 1", price: 15 },
      { title: "Book 2", price: 12 },
      // Add more book objects within the price range
    ];

    // Mock the Book.find function to resolve with mock books
    Book.find.mockResolvedValueOnce(mockBooks);

    await findPriceRangeBook(req, res);

    expect(res.json).toHaveBeenCalledWith({ response: mockBooks });
  });

  /* This test is for the scenario where the `findPriceRangeBook` function encounters an error. */
  test("findPriceRangeBook function encounters an error", async () => {
    // Mock the Book.find function to reject with an error
    Book.find.mockRejectedValueOnce(new Error("An error occurred"));

    await findPriceRangeBook(req, res);

    expect(res.json).toHaveBeenCalledTimes(0);
  });
});
