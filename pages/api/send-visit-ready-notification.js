import ConsoleNotifyProvider from "../../src/providers/ConsoleNotifyProvider";
import withContainer from "../../src/middleware/withContainer";
import TemplateStore from "../../src/gateways/GovNotify/TemplateStore";
import {
  validateHttpMethod,
  checkIfAuthorised,
} from "../../src/helpers/apiErrorHandler";

const notifier = new ConsoleNotifyProvider();

export default withContainer(async (req, res, { container }) => {
  const { body, method } = req;
  const cookie = req.headers.cookie;
  const userIsAuthenticated = container.getUserIsAuthenticated();

  const authenticationToken = await userIsAuthenticated(cookie);

  validateHttpMethod("POST", method, res);
  checkIfAuthorised(authenticationToken, res);

  let { callId, contactNumber, contactEmail, callPassword } = body;

  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const host = req.headers.host;
  const origin = `${protocol}://${host}`;

  const visitorsUrl = `${origin}/visitors/${callId}/start?callPassword=${callPassword}`;
  const visitsUrl = `${origin}/visits/${callId}?name=Ward`;

  const sendTextMessage = container.getSendTextMessage();
  const secondTextTemplateId = TemplateStore().secondText.templateId;

  const sendEmail = container.getSendEmail();
  const secondEmailTemplateId = TemplateStore().secondEmail.templateId;

  try {
    const {
      department: ward,
      error: retrieveDepartmentError,
    } = await container.getRetrieveDepartmentById()(
      authenticationToken.wardId,
      authenticationToken.trustId
    );

    console.log(`retrieveDepartmentError: ${retrieveDepartmentError}`);

    const {
      facility,
      error: retrieveFacilityError,
    } = await container.getRetrieveFacilityById()(ward.facilityId);

    const error = retrieveDepartmentError | retrieveFacilityError;

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
          hospital_name: facility.name,
        },
        null
      );
    }

    let sendEmailResponse;
    console.log(contactEmail);
    if (contactEmail) {
      sendEmailResponse = await sendEmail(
        secondEmailTemplateId,
        contactEmail,
        {
          call_url: visitorsUrl,
          ward_name: ward.name,
          hospital_name: facility.name,
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
      console.log(sendTextMessageResponse);
      console.log(sendEmailResponse);
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
