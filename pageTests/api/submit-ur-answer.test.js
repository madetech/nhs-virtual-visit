import submitUrAnswer from "../../pages/api/submit-ur-answer";

describe("api/submit-ur-answer", () => {
  it("submitting an answer triggers a request to the azure function endpoint", () => {
    let container = {
      getLogEventGateway: jest.fn(),
    };
    submitUrAnswer({}, {}, { container });
    expect(container.getLogEventGateway).toHaveBeenCalled();
  });
});
