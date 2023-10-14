const { update } = require("../../controllers/BookController"); // Import the update function
const Book = require("../../models/Book"); // Import your Book model

jest.mock("../../models/Book");

const req = {
  body: {
    id: 1, // Replace with the desired book ID
    title: "Updated Title",
    author: "Updated Author",
    genre: "Updated Genre",
    summary: "Updated Summary",
    price: 24.99,
    pdf: "updated-pdf-url",
    coverpage: "updated-coverpage-url",
  },
};

const res = {
  json: jest.fn(),
};

describe("update function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* This test is checking if the `update` function is called successfully. */
  test("update function is called successfully", async () => {
    // Mock the Book.findOneAndUpdate function to resolve successfully
    Book.findOneAndUpdate.mockResolvedValueOnce({});

    await update(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: "Book is updated successfully" });
  });

  /* This test is for the scenario where the `update` function encounters an error. */
  test("update function encounters an error", async () => {
    // Mock the Book.findOneAndUpdate function to reject with an error
    Book.findOneAndUpdate.mockRejectedValueOnce(new Error("An error occurred"));

    await update(req, res);

    expect(res.json).toHaveBeenCalledTimes(0);
  });
});
