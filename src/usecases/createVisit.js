import { SCHEDULED } from "../../src/helpers/visitStatus";
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
      // const { id, call_id } = await insertVisit(t, visit);
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

const insertVisit = async (db, visit, wardId) => {
  const { id, call_id } = await db.one(
    `INSERT INTO scheduled_calls_table
      (id, patient_name, recipient_email, recipient_number, recipient_name, call_time, call_id, provider, ward_id, call_password, status)
      VALUES (default, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, call_id
    `,
    [
      visit.patientName,
      visit.contactEmail || "",
      visit.contactNumber || "",
      visit.contactName || "",
      visit.callTime,
      visit.callId,
      visit.provider,
      wardId,
      visit.callPassword,
      SCHEDULED,
    ]
  );

  return { id, callId: call_id };
};

export { insertVisit, createVisit };
