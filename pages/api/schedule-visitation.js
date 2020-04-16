import { NotifyClient } from "notifications-node-client";
import RandomIdProvider from "../../src/providers/RandomIdProvider";
import ConsoleNotifyProvider from "../../src/providers/ConsoleNotifyProvider";
import moment from "moment";
import withContainer from "../../src/middleware/withContainer";

const ids = new RandomIdProvider();
const notifier = new ConsoleNotifyProvider();

const apiKey = process.env.API_KEY;
const templateId = process.env.SMS_INITIAL_TEMPLATE_ID;

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

export default withContainer(async ({ body, method }, res, { container }) => {
  if (method !== "POST") {
    res.status(406);
    res.end();
    return;
  }

  const validationErrors = getValidationErrors(body);
  if (validationErrors) {
    res.status(400);
    res.end(JSON.stringify({ err: validationErrors }));
    return;
  }

  var notifyClient = new NotifyClient(apiKey);

  try {
    const callId = ids.generate();

    const createVisitation = container.getCreateVisitation();

    await createVisitation({
      patientName: body.patientName,
      contactNumber: body.contactNumber,
      callTime: moment(body.callTime).toISOString(),
      callId: callId,
    });

    await notifyClient.sendSms(templateId, body.contactNumber, {
      personalisation: { call_time: formatDate(body.callTime) },
      reference: null,
    });

    notifier.notify(body.contactNumber, formatDate(body.callTime));

    res.status(204);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500);
    res.end(JSON.stringify({ err: err.error }));
  }
});
