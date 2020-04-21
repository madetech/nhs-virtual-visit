import ConsoleNotifyProvider from "../../src/providers/ConsoleNotifyProvider";
import RandomIdProvider from "../../src/providers/RandomIdProvider";
import TokenProvider from "../../src/providers/TokenProvider";
import { verifyTokenOrRedirect } from "../../src/usecases/verifyToken";
import { NotifyClient } from "notifications-node-client";

const ids = new RandomIdProvider();
const notifier = new ConsoleNotifyProvider();

const origin = process.env.ORIGIN;
const apiKey = process.env.API_KEY;
const templateId = process.env.TEMPLATE_ID;

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

  const { callId, contactNumber } = body;
  console.log(callId);
  const waitingRoomUrl = `${origin}/visitors/waiting-room/${callId}`;
  const visitsUrl = `${origin}/visits/${callId}?name=Ward`;

  var notifyClient = new NotifyClient(apiKey);

  try {
    await notifyClient.sendSms(templateId, contactNumber, {
      personalisation: { call_url: waitingRoomUrl, ward_name: "Defoe Ward" },
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
