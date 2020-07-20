import withContainer from "../../src/middleware/withContainer";
import validateVisit from "../../src/helpers/validateVisit";
import {
  NEW_NOTIFICATION,
  UPDATED_NOTIFICATION,
} from "../../src/usecases/sendBookingNotification";

const determineNotificationType = (sideA, sideB) => {
  if (
    sideA.callId != sideB.callId ||
    sideA.recipientEmail != sideB.recipientEmail ||
    sideA.recipientNumber != sideB.recipientNumber ||
    sideA.callTime != sideB.callTime
  ) {
    if (
      sideA.recipientEmail !== sideB.recipientEmail ||
      sideA.recipientNumber !== sideB.recipientNumber
    )
      return NEW_NOTIFICATION;

    return UPDATED_NOTIFICATION;
  }

  return false;
};

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    const respond = (status, response) => {
      res.status(status);
      response ? res.end(JSON.stringify(response)) : res.end();
    };

    if (method !== "PATCH") {
      respond(405);
      return;
    }

    const userIsAuthenticated = container.getUserIsAuthenticated();
    const userIsAuthenticatedResponse = await userIsAuthenticated(
      headers.cookie
    );

    if (!userIsAuthenticatedResponse) {
      respond(401, { err: "Unauthorized" });
      return;
    }

    if (!body.callId) {
      respond(400, { err: { callId: "callId must be present" } });
      return;
    }

    const { validVisit, errors } = validateVisit({
      patientName: body.patientName,
      contactName: body.contactName,
      contactEmail: body.contactEmail,
      contactNumber: body.contactNumber,
      callTime: body.callTime,
    });

    if (!validVisit) {
      respond(400, { err: errors });
      return;
    }

    const { scheduledCall } = await container.getRetrieveVisitByCallId()(
      body.callId
    );
    if (!scheduledCall) {
      respond(404, { err: "call does not exist" });
      return;
    }

    const updatedCall = {
      callId: body.callId,
      patientName: body.patientName,
      recipientName: body.contactName,
      recipientEmail: body.contactEmail,
      recipientNumber: body.contactNumber,
      callTime: body.callTime,
    };

    try {
      await container.getUpdateVisitByCallId()(updatedCall);
      respond(200, { success: true });
    } catch (updateError) {
      console.log(updateError);
      respond(500, { err: "Failed to update visit" });
      return;
    }

    try {
      const { ward } = await container.getRetrieveWardById()(
        userIsAuthenticatedResponse.wardId,
        userIsAuthenticatedResponse.trustId
      );

      const notificationType = determineNotificationType(
        updatedCall,
        scheduledCall
      );
      if (!notificationType) return;

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
        notificationType: notificationType,
      });

      if (!bookingNotificationSuccess) {
        respond(500, { err: bookingNotificationErrors });
        return;
      }
    } catch (notificationError) {
      console.log(notificationError);
      respond(500, { err: "Failed to send notification" });
      return;
    }
  }
);
