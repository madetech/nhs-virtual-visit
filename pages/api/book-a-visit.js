import RandomIdProvider from "../../src/providers/RandomIdProvider";
import withContainer from "../../src/middleware/withContainer";
import validateVisit from "../../src/helpers/validateVisit";
import CallIdProvider from "../../src/providers/CallIdProvider";

const ids = new RandomIdProvider();

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

    res.setHeader("Content-Type", "application/json");
    const { validVisit, errors } = validateVisit({
      patientName: body.patientName,
      contactName: body.contactName,
      contactEmail: body.contactEmail,
      contactNumber: body.contactNumber,
      callTime: body.callTime,
    });

    if (!validVisit) {
      res.status(400);
      res.end(JSON.stringify({ err: errors }));
      return;
    }
    try {
      let { wardId, trustId } = userIsAuthenticatedResponse;

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

      const createVisit = container.getCreateVisit();
      const updateWardVisitTotals = container.getUpdateWardVisitTotals();

      const { ward, error } = await container.getRetrieveWardById()(
        wardId,
        trustId
      );
      if (error) {
        throw error;
      }

      const sendBookingNotification = container.getSendBookingNotification();

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
        res.status(400);
        res.end(JSON.stringify({ err: bookingNotificationErrors }));
        return;
      }

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
