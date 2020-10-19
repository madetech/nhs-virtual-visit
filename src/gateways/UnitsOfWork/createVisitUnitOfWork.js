import logger from "../../../logger";

const createVisitUnitOfWork = ({
  getDb,
  getInsertVisitGateway,
  getUpdateWardVisitTotalsGateway,
  getSendBookingNotification,
}) => async (visit, ward) => {
  const db = await getDb();

  const {
    success: bookingNotificationSuccess,
    errors: bookingNotificationErrors,
  } = await db.tx(async (t) => {
    logger.debug("inserting visit");
    await getInsertVisitGateway()(t, visit, ward.id);

    logger.debug("updating ward totals");
    await getUpdateWardVisitTotalsGateway()(t, ward.id, visit.callTime);

    logger.debug("sending notification");
    const { success, errors } = await getSendBookingNotification()({
      mobileNumber: visit.contactNumber,
      emailAddress: visit.contactEmail,
      wardName: ward.name,
      hospitalName: ward.hospitalName,
      visitDateAndTime: visit.callTime,
    });

    return { success, errors };
  });
  return { bookingNotificationSuccess, bookingNotificationErrors };
};

export default createVisitUnitOfWork;
