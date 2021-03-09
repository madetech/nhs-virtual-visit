import { SCHEDULED, COMPLETE, statusToId } from "../../helpers/visitStatus";

export default ({ getMsSqlConnPool, logger }) => async (departmentId) => {
  const db = await getMsSqlConnPool();
  try {
    //the more complex SELECT clauses are no longer needed because the necessary
    // tables have been merged into scheduled_call as part of the move to MSSQL
    const result = await db
      .request()
      .input("scheduled", statusToId(SCHEDULED)) //[SCHEDULED]: 0,
      .input("complete", statusToId(COMPLETE)) //[COMPLETE]: 3,
      .input("department_id", departmentId)
      .query(
        `SELECT * FROM dbo.[scheduled_call]
        WHERE department_id = @department_id
        AND pii_cleared_out IS NULL
        AND (status = @scheduled OR status = @complete)
        ORDER BY call_time ASC` //patient_name, recipient_name, recipient_email, recipient_number
      );
    const scheduledCalls = result.recordset;
    //none of the following is tested, it's likely it will need to be medified somewhat to conform to the contract
    //the contract for this should be the same as PostgreSQL/retrieveVisits.js
    return {
      scheduledCalls: scheduledCalls.map((scheduledCall) => ({
        id: scheduledCall.id,
        patientName: scheduledCall.patient_name,
        recipientName: scheduledCall.recipient_name,
        recipientNumber: scheduledCall.recipient_number,
        recipientEmail: scheduledCall.recipient_email,
        callTime: scheduledCall.call_time
          ? scheduledCall.call_time.toISOString()
          : null,
        status: scheduledCall.status,
        callId: scheduledCall.uuid,
      })),
      error: null,
    };
  } catch (error) {
    logger.error(error);
    return {
      scheduledCalls: null,
      error: error.toString(),
    };
  }
};
