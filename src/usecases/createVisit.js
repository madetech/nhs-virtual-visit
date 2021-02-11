import validateVisit from "../../src/helpers/validateVisit";
import logger from "../../logger";

const createVisit = ({
  getInsertVisitGateway,
  getSendBookingNotification,
  getRetrieveFacilityById,
}) => async (visit, ward, callId, callPassword, videoProvider) => {
  const { validVisit, errors } = validateVisit(visit);

  if (!validVisit) {
    logger.error("invalid visit on create", { visit, errors });
    return { success: false, err: errors };
  }

  const populatedVisit = Object.assign({}, visit, {
    callId,
    callPassword,
    provider: videoProvider,
  });

  try {
    console.log(ward);
    console.log(populatedVisit);

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

    console.log(facility);

    const {
      errors: bookingNotificationErrors,
    } = await getSendBookingNotification()({
      mobileNumber: visit.contactNumber,
      emailAddress: visit.contactEmail,
      wardName: ward.name,
      hospitalName: facility.name,
      visitDateAndTime: visit.callTime,
    });

    if (bookingNotificationErrors) {
      return { success: false, err: bookingNotificationErrors };
    }

    return { success: true, err: null };
  } catch (err) {
    logger.error("failed to create visit", err);
    return { success: false, err: err };
  }
};

export default createVisit;
