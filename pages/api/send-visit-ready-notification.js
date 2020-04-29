import ConsoleNotifyProvider from "../../src/providers/ConsoleNotifyProvider";
import withContainer from "../../src/middleware/withContainer";

const notifier = new ConsoleNotifyProvider();

export default withContainer(async (req, res, { container }) => {
  const { body, method } = req;
  const cookie = req.headers.cookie;
  const userIsAuthenticated = container.getUserIsAuthenticated();

  if (!userIsAuthenticated(cookie)) {
    res.status(401);
    res.end();
    return;
  }

  if (method !== "POST") {
    res.status(406);
    res.end();
    return;
  }

  let { callId, contactNumber } = body;

  const waitingRoomUrl = `${process.env.ORIGIN}/visitors/waiting-room/${callId}`;
  const visitsUrl = `${process.env.ORIGIN}/visits/${callId}?name=Ward`;

  const sendTextMessage = container.getSendTextMessage();
  const templateId = process.env.TEMPLATE_ID;

  try {
    const response = await sendTextMessage(
      templateId,
      contactNumber,
      {
        call_url: waitingRoomUrl,
        ward_name: "Defoe Ward",
        hospital_name: "Northwick Park Hospital",
      },
      null
    );

    if (response.success) {
      notifier.notify(body.contactNumber, waitingRoomUrl);

      res.status(201);
      res.end(JSON.stringify({ id: callId, callUrl: visitsUrl }));
    } else {
      res.status(400);
      res.end(JSON.stringify({ err: "Failed to schedule a visit" }));
    }
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end(JSON.stringify({ err: "Failed to send visit ready notification" }));
  }
});
