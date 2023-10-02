const { getPublisher } = require("../../controllers/AuthController");
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

describe("getPublisher function", () => {
  /* This test is checking if the `getPublisher` function is called successfully and if it returns the
  expected response. */
  test("getPublisher function is called successfully and get the message", async () => {
    Publisher.findOne.mockResolvedValueOnce(req.body);
    await getPublisher(req, res);
    // Adjust your test expectation to match the actual data structure
    expect(res.json).toHaveBeenCalledWith({
      message: "Publisher data is fetched successfully.",
      publisher: {
        id: 1,
      },
    });
  });

 /* The code block is testing the scenario where the `getPublisher` function is called unsuccessfully. */
  test("getPublisher function is called unsuccessfully", async () => {
    Publisher.findOne.mockRejectedValueOnce({});
    await getPublisher(req, res);
    expect(res.json).toHaveBeenCalledTimes(0);
  });
});
