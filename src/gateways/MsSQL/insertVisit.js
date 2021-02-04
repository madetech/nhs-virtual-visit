import { statusToId, SCHEDULED } from "../../helpers/visitStatus";
import logger from "../../../logger";

export default ({ getMsSqlConnPool }) => async (visit, departmentId) => {
  try {
    //patient name is now part of the same table, as is the recipient name
    const db = await getMsSqlConnPool();
    const result = await db
      .request()
      .input("patient_name", visit.patientName)
      .input("call_time", visit.callTime)
      .input("recipient_name", visit.recipientName)
      .input("recipient_number", visit.recipientNumber)
      .input("recipient_email", visit.recipientEmail)
      .input("department_id", departmentId)
      .input("status", statusToId(SCHEDULED))
      .query(
        `insert into dbo.[scheduled_call]
          ([patient_name], [call_time], [recipient_name], [recipient_number], [recipient_email], [department_id], [status])
          output inserted.*
          values (@patient_name, @call_time, @recipient_name, @recipient_number, @recipient_email, @department_id, @status)`
      );

    return {
      id: result.recordset[0].id,
      uuid: result.recordset[0].uuid,
      error: null,
    };
  } catch (error) {
    logger.error(`Error creating visit ${visit}, ${error}`);
    return {
      id: null,
      uuid: null,
      error: error.toString(),
    };
  }
};
