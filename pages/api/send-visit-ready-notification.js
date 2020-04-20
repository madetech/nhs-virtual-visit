import ConsoleNotifyProvider from "../../src/providers/ConsoleNotifyProvider";
import RandomIdProvider from "../../src/providers/RandomIdProvider";
import TokenProvider from "../../src/providers/TokenProvider";
import { verifyTokenOrRedirect } from "../../src/usecases/verifyToken";
import { NotifyClient } from "notifications-node-client";
import fetch from "node-fetch";

const ids = new RandomIdProvider();
const notifier = new ConsoleNotifyProvider();

const origin = process.env.ORIGIN;
const apiKey = process.env.API_KEY;
const templateId = process.env.TEMPLATE_ID;

const whereby = async () => {
  const response = await fetch("https://api.whereby.dev/v1/meetings", {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.WHEREBY_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      startDate: "2020-04-20T10:00:00Z",
      endDate: "2020-04-21T17:14:20Z",
    }),
  });

  let jsonResponse = await response.json();
  console.log(jsonResponse);
  let roomUrl = new URL(jsonResponse.roomUrl);
  return roomUrl.pathname.slice(1);
};

export default async (req, res) => {
  const { body, method } = req;
  const tokens = new TokenProvider(process.env.JWT_SIGNING_KEY);

  if (verifyTokenOrRedirect(req, res, { tokens }) !== true) {
    return;
  }

  if (method !== "POST") {
    res.statusCode = 406;
    res.end();
    return;
  }

  let { callId, contactNumber } = body;
  console.log(callId);

  if (process.env.WHEREBY_SPIKE) {
    callId = await whereby();
    console.log(callId);
  }

  const waitingRoomUrl = `${origin}/visitors/waiting-room/${callId}`;
  const visitsUrl = `${origin}/visits/${callId}?name=Ward`;

  var notifyClient = new NotifyClient(apiKey);

  try {
    await notifyClient.sendSms(templateId, contactNumber, {
      personalisation: {
        call_url: waitingRoomUrl,
        ward_name: "Defoe Ward",
        hospital_name: "Northwick Park Hospital",
      },
      reference: null,
    });

    notifier.notify(body.contactNumber, waitingRoomUrl);

    res.statusCode = 201;
    res.end(JSON.stringify({ id: callId, callUrl: visitsUrl }));
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end(JSON.stringify({ err: err.error }));
  }
};
