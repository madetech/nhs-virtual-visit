import moment from "moment";
import fetch from "node-fetch";

class WherebyCallIdProvider {
  constructor(callTime) {
    this.callTime = callTime;
  }

  async generate() {
    let startTime = moment(this.callTime).format();
    let endTime = moment(this.callTime).add(1, "years").format();

    const response = await fetch("https://api.whereby.dev/v1/meetings", {
      method: "POST",
      headers: {
        authorization: `Bearer ${process.env.WHEREBY_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        startDate: startTime,
        endDate: endTime,
      }),
    });

    let jsonResponse = await response.json();

    let roomUrl = new URL(jsonResponse.roomUrl);
    return roomUrl.pathname.slice(1);
  }
}

export default WherebyCallIdProvider;
