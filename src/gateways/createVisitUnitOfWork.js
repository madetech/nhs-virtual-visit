import logger from "../../logger";

const createVisitUnitOfWork = ({
  getDb,
  getInsertVisit,
  getUpdateWardVisitTotalsSql,
  getSendBookingNotification,
}) => async (visit, ward) => {
  const db = await getDb();

  const { bookingNotificationSuccess, bookingNotificationErrors } = await db.tx(
    async (t) => {
      logger.debug("inserting visit");
      await getInsertVisit()(t, visit, ward.id);

      logger.debug("updating ward totals");
      await getUpdateWardVisitTotalsSql()(t, ward.id, visit.callTime);

      logger.debug("sending notification");
      const {
        success: bookingNotificationSuccess,
        errors: bookingNotificationErrors,
      } = await getSendBookingNotification()({
        mobileNumber: visit.contactNumber,
        emailAddress: visit.contactEmail,
        wardName: ward.name,
        hospitalName: ward.hospitalName,
        visitDateAndTime: visit.callTime,
      });

      return { bookingNotificationSuccess, bookingNotificationErrors };
    }
  );
  return { bookingNotificationSuccess, bookingNotificationErrors };
};

export default createVisitUnitOfWork;
