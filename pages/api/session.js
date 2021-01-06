import withContainer from "../../src/middleware/withContainer";
import { WARD_STAFF, TRUST_ADMIN, ADMIN } from "../../src/helpers/userTypes";
import { v4 as uuidv4 } from "uuid";
import logger from "../../logger";
import featureIsEnabled from "../../src/helpers/featureFlag";

export default withContainer(async (req, res, { container }) => {
  const { code, password } = req.body;

  const method = req.method;

  if (method === "POST") {
    const sessionId = uuidv4();
    let verifyWardCodeResponse = {};
    if (password === undefined) {
      const verifyWardCode = container.getVerifyWardCode();
      verifyWardCodeResponse = await verifyWardCode(code);
    }

    const verifyUserLogin = container.getVerifyUserLogin();
    const verifyUserLoginResponse = await verifyUserLogin(code, password);

    if (
      !verifyUserLoginResponse.validUser &&
      !verifyWardCodeResponse.validWardCode
    ) {
      res.statusCode = 401;
      res.end();
      return;
    }

    let token = undefined;
    const tokens = container.getTokenProvider();
    const trustManager =
      verifyUserLoginResponse.validUser &&
      verifyUserLoginResponse.type === "manager";
    const admin =
      verifyUserLoginResponse.validUser &&
      verifyUserLoginResponse.type === "admin";

    if (trustManager) {
      token = tokens.generate({
        wardId: undefined,
        wardCode: undefined,
        trustId: verifyUserLoginResponse.trust_id,
        type: TRUST_ADMIN,
      });
    } else if (admin) {
      token = tokens.generate({
        wardId: undefined,
        wardCode: undefined,
        trustId: undefined,
        type: ADMIN,
      });
    } else {
      const { ward } = verifyWardCodeResponse;
      token = tokens.generate({
        wardId: ward.id,
        wardCode: ward.code,
        trustId: ward.trustId,
        type: WARD_STAFF,
      });

      const event = {
        sessionId: sessionId,
        correlationId: req.headers["x-correlation-id"],
        createdOn: Date.now(),
        streamName: `ward-${ward.id}`,
        trustId: ward.trustId,
        eventType: "logged-in-ward-staff",
        event: {
          wardId: ward.id,
        },
      };

      if (featureIsEnabled("EVENT_LOGGING")) {
        const logEvent = container.getLogEventGateway();
        const logEventResponse = await logEvent(event);
        if (logEventResponse.status != 201) {
          logger.error(`Failed to record login event for ward id ${ward.id}`);
        } else if (logEventResponse.status == 201) {
          logger.info(`The login event has been recorded`);
        }
      }
    }

    const expiryHours = 14;
    let expiry = new Date();
    if (verifyUserLoginResponse.validUser) {
      expiry.setTime(expiry.getTime() + 1 * 60 * 60 * 1000);
    } else {
      expiry.setTime(expiry.getTime() + expiryHours * 60 * 60 * 1000);
    }

    res.writeHead(201, {
      "Set-Cookie": [
        `token=${token}; httpOnly; path=/; expires=${expiry}`,
        `sessionId=${sessionId}; httpOnly; path=/; expires=${expiry}`,
      ],
    });

    res.end(
      JSON.stringify({ wardId: code, userType: verifyUserLoginResponse.type })
    );
    return;
  } else if (method === "DELETE") {
    const expired = new Date(0);

    res.writeHead(201, {
      "Set-Cookie": [
        `token=''; httpOnly; path=/; expires=${expired}`,
        `sessionId=''; httpOnly; path=/; expires=${expired}`,
      ],
    });
    res.end(JSON.stringify({ wardId: code }));
    return;
  } else {
    res.statusCode = 405;
    res.end();
    return;
  }
});
