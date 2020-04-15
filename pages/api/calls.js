import ConsoleNotifyProvider from '../../src/providers/ConsoleNotifyProvider';
import RandomIdProvider from '../../src/providers/RandomIdProvider';
import { NotifyClient } from 'notifications-node-client'

const ids = new RandomIdProvider();
const notifier = new ConsoleNotifyProvider();

const origin = process.env.ORIGIN;
const apiKey = process.env.API_KEY;
const templateId = process.env.TEMPLATE_ID;

export default async ({ body, method }, res) => {
  if (method !== 'POST') {
    res.statusCode = 406;
    res.end();
    return;
  }

  const callId = ids.generate();
  const callUrl = `${origin}/call/${callId}`;

  var notifyClient = new NotifyClient(apiKey);

  try {
    await notifyClient.sendSms(templateId, body.contactNumber, {
      personalisation:{'call_url': callUrl},
      reference: null
    })

    notifier.notify(body.contactNumber, callUrl);

    res.statusCode = 201;
    res.end(JSON.stringify({ id: callId, callUrl }));
  } catch (err) {
    console.error({ err: err.error });
    res.statusCode = 500;
    res.end(JSON.stringify({ err: err.error }));
  }
}
