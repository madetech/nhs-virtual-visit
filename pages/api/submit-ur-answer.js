import withContainer from "../../src/middleware/withContainer";
import { v4 as uuidv4 } from "uuid";

export default withContainer(async (req, res, { container }) => {
  const logEvent = container.getLogEventGateway();
  const sessionId = uuidv4();

  const event = {
    sessionId: sessionId,
    correlationId: req.headers["x-correlation-id"],
    createdOn: Date.now(),
    streamName: "user research",
    trustId: "not applicable",
    eventType: "ur-question-answered",
    event: {
      answer: req.body["would miss nhs vv"],
    },
  };

  await logEvent(event);
});
