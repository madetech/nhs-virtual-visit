import validateVisit from "../../src/helpers/validateVisit";

const createVisit = ({
  getInsertVisitGateway,
  getSendBookingNotification,
  getRetrieveFacilityById
}) => async (visit, ward, callId, callPassword, videoProvider) => {
  const { validVisit, errors } = validateVisit(visit);

  if (!validVisit) {
    return { success: false, err: errors };
  }

  const populatedVisit = Object.assign({}, visit, {
    callId,
    callPassword,
    provider: videoProvider,
  });

  try {
    const { error: insertVisitError } = await getInsertVisitGateway()(
      populatedVisit,
      ward.id
    );

    if (insertVisitError) {
      return { success: false, err: insertVisitError };
    }

    const {
      facility,
      error: retrieveFacilityError,
    } = await getRetrieveFacilityById()(ward.facilityId);

    if (retrieveFacilityError) {
      return { success: false, err: retrieveFacilityError };
    }

    const {
      errors: bookingNotificationErrors,
    } = await getSendBookingNotification()({
      mobileNumber: visit.recipientNumber,
      emailAddress: visit.recipientEmail,
      wardName: ward.name,
      hospitalName: facility.name,
      visitDateAndTime: visit.callTime,
    });

    if (bookingNotificationErrors) {
      return { success: false, err: bookingNotificationErrors };
    }

    return { success: true, err: null };
  } catch (err) {
    return { success: false, err: err };
  }
};

export default createVisit;
