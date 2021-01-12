import logger from "../../../logger";
import Database from "../Database";
import insertVisit from "../PostGreSQL/insertVisit";
import updateWardVisitTotals from "../PostGreSQL/updateWardVisitTotals";

const createVisitUnitOfWork = (sendBookingNotification) => async (
  visit,
  ward
) => {
  const db = await Database.getInstance();

  let success = true;
  let err = null;
  await db
    .tx(async (t) => {
      logger.debug("inserting visit");
      await insertVisit(t, visit, ward.id);

      logger.debug("updating ward totals");
      await updateWardVisitTotals(t, ward.id, visit.callTime);

      logger.debug("sending notification");
      const {
        success: bookingNotificationSuccess,
        errors: bookingNotificationErrors,
      } = await sendBookingNotification({
        mobileNumber: visit.contactNumber,
        emailAddress: visit.contactEmail,
        wardName: ward.name,
        hospitalName: ward.hospitalName,
        visitDateAndTime: visit.callTime,
      });

      if (!bookingNotificationSuccess) {
        logger.error("sending notification failed", {
          visit,
          bookingNotificationErrors,
        });
        throw "Failed to send notification";
      }
    })
    .catch((error) => {
      success = false;
      err = error;
      return { success: false, error };
    });
  return { success: success, error: err };
};

export default createVisitUnitOfWork;
