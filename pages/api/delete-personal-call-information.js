import withContainer from "../../src/middleware/withContainer";
import {
  validateHttpMethod
} from "../../src/helpers/apiErrorHandler";

export default withContainer(
  async ({ body, method }, res, { container }) => {
    validateHttpMethod("PATCH", method, res);

    if (!body.clearOutTime) {
      res.status(401);
      res.end(JSON.stringify({ err: "clearOutTime must be present" }));
      return;
    }

    res.setHeader("Content-Type", "application/json");
  
    const deleteRecipientInformationForPii = container.getDeleteRecipientInformationForPii();
    const { message, error } = await deleteRecipientInformationForPii({ clearOutTime: body.clearOutTime });

    if (error) {
      res.status(401);
      res.end(JSON.stringify({ err: message }));
    } else {
      res.status(201)
      res.end(JSON.stringify({ message }));
    }
  }
);
