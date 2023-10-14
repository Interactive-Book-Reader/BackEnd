const { store } = require("../../controllers/BookController"); // Import the store function
const Book = require("../../models/Book"); // Import your Book model

jest.mock("../../models/Book");

const req = {
  body: {
    title: "Book Title",
    author: "Author Name",
    genre: "Genre",
    summary: "Book Summary",
    price: 19.99,
    pdf: "pdf-url",
    coverpage: "coverpage-url",
    ISBN: "ISBN12345",
    publisher_id: 1, // Replace with the desired publisher ID
  },
};

const res = {
  json: jest.fn(),
};

describe("store function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* This test is checking if the `store` function is called successfully. */
  test("store function is called successfully", async () => {
    // Mock the book.save function to resolve successfully
    Book.prototype.save = jest.fn().mockResolvedValueOnce({});

    await store(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: "Book is successfuly added" });
  });

  /* This test is for the scenario where the `store` function encounters an error. */
  test("store function encounters an error", async () => {
    // Mock the book.save function to reject with an error
    Book.prototype.save = jest.fn().mockRejectedValueOnce(new Error("An error occurred"));

    await store(req, res);

    expect(res.json).toHaveBeenCalledTimes(0);
  });
});
