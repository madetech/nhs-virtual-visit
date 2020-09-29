import RandomIdProvider from "../../src/providers/RandomIdProvider";
import withContainer from "../../src/middleware/withContainer";
import validateVisit from "../../src/helpers/validateVisit";
import CallIdProvider from "../../src/providers/CallIdProvider";
import logger from "../../logger";

const ids = new RandomIdProvider();

/*
wep api adapter level - mvc / express / protobuff rpc, socket,  something
  - takes some stuff and maps onto a command and returns response (or error codes)

  Hex architecture
  ports - delivery mechanism
  domain
  adapter - gateway - repo (entity io)
*/

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    if (method !== "POST") {
      res.status(406);
      res.end();
      return;
    }

    const userIsAuthenticated = container.getUserIsAuthenticated();
    const userIsAuthenticatedResponse = await userIsAuthenticated(
      headers.cookie
    );

    if (!userIsAuthenticatedResponse) {
      res.status(401);
      res.end(JSON.stringify({ err: "Unauthorized" }));
      return;
    }

    let { wardId, trustId } = userIsAuthenticatedResponse;

    // Validate
    res.setHeader("Content-Type", "application/json");

    const { validVisit, errors } = validateVisit({
      patientName: body.patientName,
      contactName: body.contactName,
      contactEmail: body.contactEmail,
      contactNumber: body.contactNumber,
      callTime: body.callTime,
    });

    // handle validation response
    if (!validVisit) {
      res.status(400);
      res.end(JSON.stringify({ err: errors }));
      return;
    }

    try {
      const { trust, error: trustErr } = await container.getRetrieveTrustById()(
        trustId
      );
      if (trustErr) {
        throw trustErr;
      }

      const callIdProvider = new CallIdProvider(
        trust.videoProvider,
        body.callTime
      );
      const callId = await callIdProvider.generate();
      let callPassword = ids.generate(10);

      const updateWardVisitTotals = container.getUpdateWardVisitTotals();

      const { ward, error } = await container.getRetrieveWardById()(
        wardId,
        trustId
      );
      if (error) {
        throw error;
      }

      const sendBookingNotification = container.getSendBookingNotification();

      logger.debug("sending notification");
      const {
        success: bookingNotificationSuccess,
        errors: bookingNotificationErrors,
      } = await sendBookingNotification({
        mobileNumber: body.contactNumber,
        emailAddress: body.contactEmail,
        wardName: ward.name,
        hospitalName: ward.hospitalName,
        visitDateAndTime: body.callTime,
      });

      if (!bookingNotificationSuccess) {
        logger.debug("sending notification failed", bookingNotificationErrors);
        res.status(400);
        res.end(JSON.stringify({ err: bookingNotificationErrors }));
        return;
      }

      logger.debug("sending creating Visit (book-a-visit)");
      const createVisit = await container.getCreateVisit();

      console.log({ createVisit });
      logger.debug(createVisit);
      await createVisit({
        patientName: body.patientName,
        contactEmail: body.contactEmail,
        contactNumber: body.contactNumber,
        contactName: body.contactName,
        callTime: body.callTime,
        callTimeLocal: body.callTimeLocal,
        callId: callId,
        provider: trust.videoProvider,
        wardId: ward.id,
        callPassword: callPassword,
      });

      await updateWardVisitTotals({ wardId: ward.id, date: body.callTime });

      res.status(201);
      res.end(JSON.stringify({ success: true }));
    } catch (err) {
      console.error(err);
      res.status(500);
      res.end(JSON.stringify({ err: "Failed to schedule a visit" }));
    }
  }
);
