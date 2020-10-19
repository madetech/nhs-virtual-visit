import validateVisit from "../../src/helpers/validateVisit";
import logger from "../../logger";

const createVisit = (
  getRandomIdProvider,
  getCallIdProvider,
  getRetrieveTrustById,
  retrieveWardById,
  createVisitUnitOfWork
) => async (visit, wardId, trustId) => {
  if (!wardId) throw "creating visit with no wardId";
  if (!trustId) throw "creating visit with no trustId";

  const { validVisit, errors } = validateVisit(visit);

  if (!validVisit) {
    logger.error("invalid visit on create", { visit, errors });
    return { success: false, err: errors };
  }

  const { trust, error: trustErr } = await getRetrieveTrustById(trustId);
  if (trustErr) {
    throw trustErr;
  }

  const { ward, error } = await retrieveWardById(wardId, trustId);
  if (error) {
    throw error;
  }

  const callId = await getCallIdProvider(trust, visit.callTime);

  const callPassword = getRandomIdProvider().generate(10);
  const populatedVisit = Object.assign({}, visit, {
    callId,
    callPassword,
    provider: trust.videoProvider,
  });

  try {
    const {
      bookingNotificationSuccess,
      bookingNotificationErrors,
    } = await createVisitUnitOfWork(populatedVisit, ward);

    if (!bookingNotificationSuccess) {
      logger.error("sending notification failed", {
        populatedVisit,
        bookingNotificationErrors,
      });
      throw "Failed to send notification";
    }

    return { success: true, err: undefined };
  } catch (err) {
    logger.error("failed to create visit", err);
    return { success: false, err: err };
  }
};

export default createVisit;
