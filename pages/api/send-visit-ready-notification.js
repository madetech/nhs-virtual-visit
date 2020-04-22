import ConsoleNotifyProvider from "../../src/providers/ConsoleNotifyProvider";
import TokenProvider from "../../src/providers/TokenProvider";
import { verifyTokenOrRedirect } from "../../src/usecases/verifyToken";
import withContainer from "../../src/middleware/withContainer";

const notifier = new ConsoleNotifyProvider();

const origin = process.env.ORIGIN;
const templateId = process.env.TEMPLATE_ID;

export default withContainer(async (req, res, { container }) => {
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

  const waitingRoomUrl = `${origin}/visitors/waiting-room/${callId}`;
  const visitsUrl = `${origin}/visits/${callId}?name=Ward`;

  const notifyClient = container.getNotifyClient();

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
    res.end(JSON.stringify({ err: "Failed to send visit ready notification" }));
  }
});
