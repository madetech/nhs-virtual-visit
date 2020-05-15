import { WebClient } from "@slack/web-api";

class Slack {
  constructor(token) {
    this.slackWebApi = new WebClient(token);
  }

  async postMessage({ text, channel }) {
    try {
      await this.slackWebApi.chat.postMessage({ text, channel });

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: true };
    }
  }
}

export default Slack;
