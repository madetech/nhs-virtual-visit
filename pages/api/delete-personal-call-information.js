import withContainer from "../../src/middleware/withContainer";
import {
  validHttpMethod
} from "../../src/helpers/apiErrorHandler";
import { reset } from "cypress/types/sinon";

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    validHttpMethod("DELETE", method, res);

    res.setHeader("Content-Type", "application/json");

    try {
      const scheduledCalls = container.getScheduledCalls();
      const { calls, error: callsError} = await scheduledCalls();
  
      if (callsError) {
        res.status(400);
        res.end(JSON.stringify({ error: "error retrieving scheduled calls" }));
        return;
      }
    } catch (error) {
      res.status(500);
      res.end(JSON.stringify({
        error: "500 (Internal Server Error). Please try again later.",
      }));
    }
  }
);