import ConsoleNotifyProvider from "../../src/providers/ConsoleNotifyProvider";
import withContainer from "../../src/middleware/withContainer";
import TemplateStore from "../../src/gateways/GovNotify/TemplateStore";

const notifier = new ConsoleNotifyProvider();

export default withContainer(async (req, res, { container }) => {
  const { body, method } = req;
  const cookie = req.headers.cookie;
  const userIsAuthenticated = container.getUserIsAuthenticated();

  const authenticationToken = await userIsAuthenticated(cookie);

  if (!authenticationToken) {
    res.status(401);
    res.end();
    return;
  }

  if (method !== "POST") {
    res.status(406);
    res.end();
    return;
  }

  let { callId, contactNumber, contactEmail, callPassword } = body;

  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const host = req.headers.host;
  const origin = `${protocol}://${host}`;

  const visitorsUrl = `${origin}/visitors/${callId}/start?callPassword=${callPassword}`;
  const visitsUrl = `${origin}/visits/${callId}?name=Ward`;

  const sendTextMessage = container.getSendTextMessage();
  const secondTextTemplateId = TemplateStore.secondText.templateId;

  const sendEmail = container.getSendEmail();
  const secondEmailTemplateId = TemplateStore.secondEmail.templateId;

  try {
    const { ward, error } = await container.getRetrieveWardById()(
      authenticationToken.wardId,
      authenticationToken.trustId
    );
    if (error) {
      throw error;
    }

    let sendTextMessageResponse;
    if (contactNumber) {
      sendTextMessageResponse = await sendTextMessage(
        secondTextTemplateId,
        contactNumber,
        {
          call_url: visitorsUrl,
          ward_name: ward.name,
          hospital_name: ward.hospitalName,
        },
        null
      );
    }

    let sendEmailResponse;
    if (contactEmail) {
      sendEmailResponse = await sendEmail(
        secondEmailTemplateId,
        contactEmail,
        {
          call_url: visitorsUrl,
          ward_name: ward.name,
          hospital_name: ward.hospitalName,
        },
        null
      );
    }

    if (
      (sendTextMessageResponse?.success && sendEmailResponse?.success) ||
      (sendTextMessageResponse?.success && !sendEmailResponse) ||
      (sendEmailResponse?.success && !sendTextMessageResponse)
    ) {
      notifier.notify(visitorsUrl);

      res.status(201);
      res.end(JSON.stringify({ id: callId, callUrl: visitsUrl }));
    } else {
      res.status(400);
      res.end(
        JSON.stringify({ err: "Failed to send visit ready notification" })
      );
    }
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end(JSON.stringify({ err: "Failed to send visit ready notification" }));
  }
});
