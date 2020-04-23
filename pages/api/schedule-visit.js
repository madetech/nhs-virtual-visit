import RandomIdProvider from "../../src/providers/RandomIdProvider";
import ConsoleNotifyProvider from "../../src/providers/ConsoleNotifyProvider";
import moment from "moment";
import withContainer from "../../src/middleware/withContainer";
import fetch from "node-fetch";

const ids = new RandomIdProvider();
const notifier = new ConsoleNotifyProvider();

const templateId = process.env.SMS_INITIAL_TEMPLATE_ID;

const wherebyCallId = async (callTime) => {
  let startTime = moment(callTime).subtract(30, "minutes").format();
  let endTime = moment(callTime).add(2, "hours").format();

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

const formatDate = (date) => moment(date).format("D MMMM YYYY, h.mma");

const getValidationErrors = ({ patientName, contactNumber, callTime }) => {
  if (!patientName || patientName.length === 0) {
    return "patientName must be a string";
  }

  if (!contactNumber || contactNumber.length !== 11) {
    return "contactNumber must be a number with 11 digits";
  }

  try {
    moment(callTime);
  } catch (err) {
    return "callTime is not a valid date";
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

    if (!userIsAuthenticated(headers.cookie)) {
      res.status(401);
      res.end();
      return;
    }

    res.setHeader("Content-Type", "application/json");

    const validationErrors = getValidationErrors(body);
    if (validationErrors) {
      res.status(400);
      res.end(JSON.stringify({ err: validationErrors }));
      return;
    }

    try {
      let callId = ids.generate();

      if (process.env.ENABLE_WHEREBY == "yes") {
        callId = await wherebyCallId(body.callTime);
      }

      const createVisit = container.getCreateVisit();

      await createVisit({
        patientName: body.patientName,
        contactNumber: body.contactNumber,
        callTime: body.callTime,
        callTimeLocal: body.callTimeLocal,
        callId: callId,
        provider: process.env.ENABLE_WHEREBY === "yes" ? "whereby" : "jitsi",
      });

      const notifyClient = container.getNotifyClient();

      await notifyClient.sendSms(templateId, body.contactNumber, {
        personalisation: {
          call_time: formatDate(body.callTime),
          ward_name: "Defoe Ward",
          hospital_name: "Northwick Park Hospital",
        },
        reference: null,
      });

      notifier.notify(body.contactNumber, formatDate(body.callTimeLocal));

      res.status(201);
      res.end(JSON.stringify({ success: true }));
    } catch (err) {
      console.error(err);
      res.status(500);
      res.end(JSON.stringify({ err: "Failed to schedule a visit" }));
    }
  }
);
