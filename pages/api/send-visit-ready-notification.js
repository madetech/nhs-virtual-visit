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

  const visitorsUrl = `${process.env.ORIGIN}/visitors/${callId}/start`;
  const visitsUrl = `${process.env.ORIGIN}/visits/${callId}?name=Ward`;

  const sendTextMessage = container.getSendTextMessage();
  const templateId = process.env.TEMPLATE_ID;

  try {
    // Passing in null as we don't care about the ID just yet
    const { ward, error } = await container.getWardById()(null);
    if (error) {
      throw error;
    }

    const response = await sendTextMessage(
      templateId,
      contactNumber,
      {
        call_url: visitorsUrl,
        ward_name: ward.name,
        hospital_name: ward.hospitalName,
      },
      null
    );

    if (response.success) {
      notifier.notify(body.contactNumber, visitorsUrl);

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
