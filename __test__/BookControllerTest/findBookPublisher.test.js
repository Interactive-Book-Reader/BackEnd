const { findBookByPublisher } = require("../../controllers/BookController"); // Import the findBookByPublisher function
const Book = require("../../models/Book"); // Import your Book model

jest.mock("../../models/Book");

const req = {
  body: {
    publisher_id: 1, // Replace with the desired publisher ID
  },
};

const res = {
  json: jest.fn(),
};

describe("findBookByPublisher function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* This test is checking if the `findBookByPublisher` function is called successfully. */
  test("findBookByPublisher function is called successfully", async () => {
    const mockBooks = [
      { title: "Book 1", publisher_id: 1 },
      { title: "Book 2", publisher_id: 1 },
      // Add more book objects with the same publisher_id
    ];

    // Mock the Book.find function to resolve with mock books
    Book.find.mockResolvedValueOnce(mockBooks);

    await findBookByPublisher(req, res);

    expect(res.json).toHaveBeenCalledWith({ response: mockBooks });
  });

  /* This test is for the scenario where the `findBookByPublisher` function encounters an error. */
  test("findBookByPublisher function encounters an error", async () => {
    // Mock the Book.find function to reject with an error
    Book.find.mockRejectedValueOnce(new Error("An error occurred"));

    await findBookByPublisher(req, res);

    expect(res.json).toHaveBeenCalledTimes(0);
  });
});
