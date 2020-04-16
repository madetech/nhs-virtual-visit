import createVisitation from "../../src/usecases/createVisitation";
import { NotifyClient } from "notifications-node-client";
import RandomIdProvider from "../../src/providers/RandomIdProvider";
import ConsoleNotifyProvider from "../../src/providers/ConsoleNotifyProvider";
import moment from "moment";
import pgp from "pg-promise";

const ids = new RandomIdProvider();
const notifier = new ConsoleNotifyProvider();

const apiKey = process.env.API_KEY;
const templateId = process.env.SMS_INITIAL_TEMPLATE_ID;

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

export default async ({ body, method }, res) => {
  if (method !== "POST") {
    res.statusCode = 406;
    res.end();
    return;
  }

  const validationErrors = getValidationErrors(body);
  if (validationErrors) {
    res.statusCode = 400;
    res.end(JSON.stringify({ err: validationErrors }));
    return;
  }

  var notifyClient = new NotifyClient(apiKey);

  try {
    const callId = ids.generate();

    const container = {
      getDb() {
        return pgp()({
          connectionString: process.env.URI,
          ssl: {
            rejectUnauthorized: false,
          },
        });
      },
    };

    await createVisitation(container, {
      patientName: body.patientName,
      contactNumber: body.contactNumber,
      callTime: moment(body.callTime).toISOString(),
      callId: callId,
    });

    await notifyClient.sendSms(templateId, body.contactNumber, {
      personalisation: { call_time: moment(body.callTime).toString() },
      reference: null,
    });

    notifier.notify(body.contactNumber, moment(body.callTime).toString());

    res.statusCode = 204;
    res.end();
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end(JSON.stringify({ err: err.error }));
  }
};
