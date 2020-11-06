import withContainer from "../../src/middleware/withContainer";
import { WARD_STAFF, TRUST_ADMIN, ADMIN } from "../../src/helpers/userTypes";
import { v4 as uuidv4 } from "uuid";
import logger from "../../logger";

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

    const verifyTrustAdminCode = container.getVerifyTrustAdminCode();
    const verifyTrustAdminCodeResponse = await verifyTrustAdminCode(
      code,
      password
    );

    const verifyAdminCode = container.getVerifyAdminCode();
    const verifyAdminCodeResponse = await verifyAdminCode(code, password);

    if (
      !verifyTrustAdminCodeResponse.validTrustAdminCode &&
      !verifyWardCodeResponse.validWardCode &&
      !verifyAdminCodeResponse.validAdminCode
    ) {
      res.statusCode = 401;
      res.end();
      return;
    }

    let token = undefined;
    const tokens = container.getTokenProvider();
    if (verifyTrustAdminCodeResponse.validTrustAdminCode) {
      token = tokens.generate({
        wardId: undefined,
        wardCode: undefined,
        trustId: verifyTrustAdminCodeResponse.trust.id,
        type: TRUST_ADMIN,
      });
    } else if (verifyAdminCodeResponse.validAdminCode) {
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

      if (process.env.TEST_EVENT === "TRUE") {
        event.test = true;
      }

      const logEvent = container.getLogEventGateway(event);
      const logEventResponse = await logEvent(event);
      if (logEventResponse && logEventResponse.status == 201) {
        logger.info(`The login event has been recorded`);
      }
    }

    const expiryHours = 14;
    let expiry = new Date();
    if (
      verifyTrustAdminCodeResponse.validTrustAdminCode ||
      verifyAdminCodeResponse.validAdminCode
    ) {
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
    res.end(JSON.stringify({ wardId: code }));
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
    res.statusCode = 406;
    res.end();
    return;
  }
});
