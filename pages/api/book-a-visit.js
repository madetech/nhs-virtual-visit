import RandomIdProvider from "../../src/providers/RandomIdProvider";
import ConsoleNotifyProvider from "../../src/providers/ConsoleNotifyProvider";
import moment from "moment";
import withContainer from "../../src/middleware/withContainer";
import fetch from "node-fetch";
import formatDateAndTime from "../../src/helpers/formatDateAndTime";
import formatDate from "../../src/helpers/formatDate";
import formatTime from "../../src/helpers/formatTime";
import validateDateAndTime from "../../src/helpers/validateDateAndTime";
import TemplateStore from "../../src/gateways/GovNotify/TemplateStore";

const ids = new RandomIdProvider();
const notifier = new ConsoleNotifyProvider();

const wherebyCallId = async (callTime) => {
  let startTime = moment(callTime).format();
  let endTime = moment(callTime).add(1, "years").format();

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
};

const isFieldAbsent = (field) => {
  return !field || field.length === 0;
};

const getValidationErrors = (
  container,
  { patientName, contactEmail, contactNumber, callTime }
) => {
  const validateMobileNumber = container.getValidateMobileNumber();
  const validateEmailAddress = container.getValidateEmailAddress();

  if (isFieldAbsent(patientName)) {
    return "patientName must be a string";
  }

  if (isFieldAbsent(contactEmail) && isFieldAbsent(contactNumber)) {
    return "contactNumber or contactEmail must be present";
  }

  if (!isFieldAbsent(contactNumber) && !validateMobileNumber(contactNumber)) {
    return "contactNumber must be a valid mobile number";
  }

  if (!isFieldAbsent(contactEmail) && !validateEmailAddress(contactEmail)) {
    return "contactEmail must be a valid email address";
  }

  const { isValidTime, isValidDate, errorMessage } = validateDateAndTime(
    callTime
  );

  if (!isValidTime) {
    return errorMessage;
  }

  if (!isValidDate) {
    return errorMessage;
  }

  return null;
};

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    if (method !== "POST") {
      res.status(406);
      res.end();
      return;
    }

    const userIsAuthenticated = container.getUserIsAuthenticated();
    const userIsAuthenticatedResponse = await userIsAuthenticated(
      headers.cookie
    );

    if (!userIsAuthenticatedResponse) {
      res.status(401);
      res.end(JSON.stringify({ err: "Unauthorized" }));
      return;
    }

    res.setHeader("Content-Type", "application/json");
    const validationErrors = getValidationErrors(container, body);
    if (validationErrors) {
      res.status(400);
      res.end(JSON.stringify({ err: validationErrors }));
      return;
    }

    try {
      let callId = ids.generate();
      let { wardId, trustId } = userIsAuthenticatedResponse;
      let callPassword = ids.generate();

      if (process.env.ENABLE_WHEREBY == "yes") {
        callId = await wherebyCallId(body.callTime);
      }

      const createVisit = container.getCreateVisit();
      const updateWardVisitTotals = container.getUpdateWardVisitTotals();

      const { ward, error } = await container.getRetrieveWardById()(
        wardId,
        trustId
      );
      if (error) {
        throw error;
      }

      await createVisit({
        patientName: body.patientName,
        contactEmail: body.contactEmail,
        contactNumber: body.contactNumber,
        contactName: body.contactName,
        callTime: body.callTime,
        callTimeLocal: body.callTimeLocal,
        callId: callId,
        provider: process.env.ENABLE_WHEREBY === "yes" ? "whereby" : "jitsi",
        wardId: ward.id,
        callPassword: callPassword,
      });

      await updateWardVisitTotals({ wardId: ward.id, date: body.callTime });

      const sendTextMessage = container.getSendTextMessage();
      const templateId = TemplateStore.firstText.templateId;

      const response = await sendTextMessage(
        templateId,
        body.contactNumber,
        {
          visit_date: formatDate(body.callTime),
          visit_time: formatTime(body.callTime),
          ward_name: ward.name,
          hospital_name: ward.hospitalName,
        },
        null
      );

      if (response.success) {
        notifier.notify(formatDateAndTime(body.callTimeLocal));

        res.status(201);
        res.end(JSON.stringify({ success: true }));
      } else {
        res.status(400);
        res.end(JSON.stringify({ err: "Failed to schedule a visit" }));
      }
    } catch (err) {
      console.error(err);
      res.status(500);
      res.end(JSON.stringify({ err: "Failed to schedule a visit" }));
    }
  }
);
