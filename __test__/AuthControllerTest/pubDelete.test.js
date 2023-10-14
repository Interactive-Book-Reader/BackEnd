const { deletePublisher } = require("../../controllers/AuthController");
const Publisher = require("../../models/Publisher");

jest.mock("../../models/Publisher");

const req = {
  body: {
    id: 1,
  },
};

const res = {
  json: jest.fn(),
};

describe("deletePublisher function", () => {
  /* This test is checking if the `deletePublisher` function is called successfully. */
  test("deletePublisher function is called successfully", async () => {
    Publisher.findOneAndDelete.mockResolvedValueOnce(req.body);
    await deletePublisher(req, res);
    expect(res.json).toHaveBeenCalledWith({
      message: "Publisher data is deleted successfully.",
    });
  });

  /* The code block is testing the scenario where the `deletePublisher` function is called
  unsuccessfully. */
  test("deletePublisher function is called unsuccessfully", async () => {
    Publisher.findOneAndDelete.mockRejectedValueOnce({});
    await deletePublisher(req, res);
    expect(res.json).toHaveBeenCalledTimes(0);
  });
});
