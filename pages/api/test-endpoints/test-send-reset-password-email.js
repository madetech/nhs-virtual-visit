import withContainer from "../../../src/middleware/withContainer";
import createTimeSensitiveLink from "../../../src/helpers/createTimeSensitiveLink";
import { validateHttpMethod } from "../../../src/helpers/apiErrorHandler";

export default withContainer(
  async ({ headers, method }, res, { container }) => {
    if (process.env.APP_ENV !== "test") {
      res.status(403);
      res.end(JSON.stringify({ error: "Can't access this endpoint from a production environment" }));
      return;
    }

    validateHttpMethod("POST", method, res);

    res.setHeader("Content-Type", "application/json");

    const retrieveManagerByEmail = container.getRetrieveManagerByEmail();
    const { 
      manager: user,
      error: retrieveError, 
    } = await retrieveManagerByEmail("nhs-manager13@nhs.co.uk");

    if (retrieveError || !user) {
      res.status(400);
      res.end(JSON.stringify({ error: "Email does not exist" }));
      return;
    }

    const addToUserVerificationTable = container.getAddToUserVerificationTable();
    const { 
      verifyUser,
      error: verificationError,
    } = await addToUserVerificationTable({
      user_id: user.id,
      type: "resetPassword",
    });

    if (verificationError) {
      res.status(400);
      res.end(JSON.stringify({ error: verificationError }));
      return;
    }
    
    const uuid = user.uuid;
    const hash = verifyUser.hash;    
    const expirationTime = "2h";
    const urlPath = "reset-password";

    const { link, linkError } = createTimeSensitiveLink({
      headers,
      uuid,
      hash,
      expirationTime,
      urlPath,
    });
  
    if (linkError) {
      res.status(401);
      res.end(
        JSON.stringify({
          error: "There was an error creating link to reset password",
        })
      );
    } else {
      res.status(201);
      res.end(JSON.stringify({ link }));
    }
  }
);
