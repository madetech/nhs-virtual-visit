import sendVisitsMilestoneNotification from "./sendVisitsMilestoneNotification";

describe("sendVisitsMilestoneNotification", () => {
  const channel = "MUCHWOW";

  beforeEach(() => {
    process.env.SLACK_CHANNEL_ID_VISITS_MILESTONE = channel;
  });

  afterEach(() => {
    process.env.SLACK_CHANNEL_ID_VISITS_MILESTONE = undefined;
  });

  it("sends a notification to Slack if 1000 visits", async () => {
    const postMessagestub = jest
      .fn()
      .mockReturnValue({ success: true, error: null });
    const slackStub = { postMessage: postMessagestub };
    const container = { getSlack: () => slackStub };

    const text =
      "We've reached a milestone:\n\n:raised_hands: The 1000th virtual visit has been booked! :raised_hands:";

    const response = await sendVisitsMilestoneNotification(container)({
      numberOfVisits: 1000,
    });

    expect(postMessagestub).toHaveBeenCalledWith({ text, channel });
    expect(response).toEqual({ milestone: true, error: null });
  });

  it("sends a notification to Slack if 1500 visits", async () => {
    const postMessagestub = jest
      .fn()
      .mockReturnValue({ success: true, error: null });
    const slackStub = { postMessage: postMessagestub };
    const container = { getSlack: () => slackStub };

    const text =
      "We've reached a milestone:\n\n:raised_hands: The 1500th virtual visit has been booked! :raised_hands:";

    const response = await sendVisitsMilestoneNotification(container)({
      numberOfVisits: 1500,
    });

    expect(postMessagestub).toHaveBeenCalledWith({ text, channel });
    expect(response).toEqual({ milestone: true, error: null });
  });

  it("only sends a notification to Slack every 500th visit", async () => {
    const postMessagestub = jest
      .fn()
      .mockReturnValue({ success: true, error: null });
    const slackStub = { postMessage: postMessagestub };
    const container = { getSlack: () => slackStub };

    const response = await sendVisitsMilestoneNotification(container)({
      numberOfVisits: 999,
    });

    expect(postMessagestub).not.toHaveBeenCalled();
    expect(response).toEqual({ milestone: false, error: null });
  });

  it("returns error as true if Slack message error", async () => {
    const postMessagestub = jest
      .fn()
      .mockReturnValue({ success: false, error: true });
    const slackStub = { postMessage: postMessagestub };
    const container = { getSlack: () => slackStub };

    const text =
      "We've reached a milestone:\n\n:raised_hands: The 1500th virtual visit has been booked! :raised_hands:";

    const response = await sendVisitsMilestoneNotification(container)({
      numberOfVisits: 1500,
    });

    expect(postMessagestub).toHaveBeenCalledWith({ text, channel });
    expect(response).toEqual({ milestone: true, error: true });
  });
});
