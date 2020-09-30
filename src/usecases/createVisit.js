import { SCHEDULED } from "../../src/helpers/visitStatus";
import validateVisit from "../../src/helpers/validateVisit";
import { updateWardVisitTotalsSql } from "./updateWardVisitTotals";
import logger from "../../logger";

const createVisit = ({ getDb }) => async (visit) => {
  const db = await getDb();

  const { validVisit, errors } = validateVisit({
    patientName: visit.patientName,
    contactName: visit.contactName,
    contactEmail: visit.contactEmail,
    contactNumber: visit.contactNumber,
    callTime: visit.callTime,
  });

  if (!validVisit) {
    logger.debug("invalid visit");
    return { success: false, err: errors };
  }
  try {
    return await db.tx(async (t) => {
      logger.debug("inserting visit");
      // const { id, call_id } = await insertVisit(t, visit);
      await insertVisit(t, visit);
      logger.debug("updating ward totals");
      await updateWardVisitTotalsSql(t, visit.wardId, visit.callTime);

      return { success: true, err: undefined };
    });
  } catch (error) {
    logger.error("failed to create visit", error);
    return { success: false, err: error };
  }
};

const insertVisit = async (db, visit) => {
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
      visit.wardId,
      visit.callPassword,
      SCHEDULED,
    ]
  );

  return { id, callId: call_id };
};

export default createVisit;
