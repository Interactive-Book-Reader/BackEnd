const { addbook } = require("../../controllers/Read_BooksController"); // Import the addbook function
const Read_Books = require("../../models/Read_Books"); // Import your Read_Books model

jest.mock("../../models/Read_Books");

const req = {
  body: {
    user_id: 1, // Replace with the desired user ID
    book_id: 1, // Replace with the desired book ID
  },
};

const res = {
  status: jest.fn().mockReturnThis(), // Mock the status function to return the response object
  json: jest.fn(),
};

describe("addbook function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* This test is checking if the `addbook` function successfully adds a read book. */
  test("addbook function adds a read book successfully", async () => {
    // Mock the Read_Books model's save function to resolve successfully
    const mockResult = {
      _id: 1, // Mock the generated _id
      user_id: req.body.user_id,
      book_id: req.body.book_id,
    };
    Read_Books.prototype.save.mockResolvedValueOnce(mockResult);

    await addbook(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Read_Book added successfully",
      result: mockResult,
    });
  });

  /* This test is for the scenario where the `addbook` function encounters an error. */
  test("addbook function encounters an error", async () => {
    // Mock the Read_Books model's save function to reject with an error
    Read_Books.prototype.save.mockRejectedValueOnce(new Error("An error occurred"));

    await addbook(req, res);
    expect(res.json).toHaveBeenCalledTimes(0);
  });
});
