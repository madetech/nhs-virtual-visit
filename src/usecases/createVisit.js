import validateVisit from "../../src/helpers/validateVisit";
import { updateWardVisitTotalsSql } from "./updateWardVisitTotals";
import logger from "../../logger";

const createVisit = (
  getDb,
  getRandomIdProvider,
  getCallIdProvider,
  getRetrieveTrustById,
  retrieveWardById,
  sendBookingNotification,
  insertVisitQuery
) => async (visit, wardId, trustId) => {
  const db = await getDb();

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
    return await db.tx(async (t) => {
      logger.debug("inserting visit");

      await insertVisitQuery(t, populatedVisit, wardId);
      logger.debug("updating ward totals");
      await updateWardVisitTotalsSql(t, wardId, populatedVisit.callTime);

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
          populatedVisit,
          bookingNotificationErrors,
        });
        throw "Failed to send notification";
      }

      return { success: true, err: undefined };
    });
  } catch (err) {
    logger.error("failed to create visit", err);
    return { success: false, err: err };
  }
};

export default createVisit;
