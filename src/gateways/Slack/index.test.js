import Slack from "./";
import { WebClient } from "@slack/web-api";

describe("Slack", () => {
  describe("#postMessage", () => {
    it("posts a message with a token", async () => {
      WebClient.mockClear();

      const text = "WOOF";
      const channel = "DOGGO";
      const token = "MEOW";
      const slack = new Slack(token);

      const slackWebApi = WebClient.mock;

      const response = await slack.postMessage({ text, channel });

      expect(slackWebApi.calls[0][0]).toEqual(token);
      expect(slackWebApi.instances[0].chat.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({ text, channel })
      );
      expect(response).toEqual({ success: true, error: null });
    });

    it("returns error as true if a SlackWebApi error", async () => {
      WebClient.mockClear();

      const text = "WOOF";
      const channel = "DOGGO";
      const token = "MEOW";
      const slack = new Slack(token);

      const slackWebApi = WebClient.mock.instances[0];
      slackWebApi.chat.postMessage.mockImplementation(() => {
        throw new Error("Slack Web API Error!");
      });

      const response = await slack.postMessage({ text, channel });

      expect(response).toEqual({ success: false, error: true });
    });
  });
});
