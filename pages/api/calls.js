import ConsoleNotifyProvider from '../../src/providers/ConsoleNotifyProvider';
import RandomIdProvider from '../../src/providers/RandomIdProvider';

const ids = new RandomIdProvider();
const notifier = new ConsoleNotifyProvider();

export default ({ body, method }, res) => {
  if (method === 'POST') {
    const callId = ids.generate();
    const callUrl = `http://localhost:3000/call/${callId}`;
    
    notifier.notify(body.contactNumber, callUrl);

    res.statusCode = 201;
    res.end(JSON.stringify({ id: callId, callUrl }));
  }

  res.statusCode = 406;
  res.end();
};
