import {
  statusToId,
  SCHEDULED,
  COMPLETE,
} from "../../helpers/visitStatus";

const retrieveScheduledCallByIdGateway = ({ getMsSqlConnPool, logger }) => async ({
  callId,
  departmentId,
}) => {
  logger.info(`Retrieving scheduled call with id ${callId}`);

  try {
    const db = await getMsSqlConnPool();
    const response = await db
      .request()
      .input("id", callId)
      .input("departmentId", departmentId)
      .input("scheduled", statusToId(SCHEDULED))
      .input("complete", statusToId(COMPLETE))
      .query(
        `SELECT * from dbo.[scheduled_call] 
          WHERE id = @id AND department_id = @departmentId
          AND pii_cleared_out IS NULL
          AND status = @scheduled OR status = @complete`
      );

    const {
      patient_name,
      recipient_email,
      recipient_name,
      recipient_number,
      call_time,
      uuid,
      id,
      department_id,
      status,
    } = response.recordset[0];
    return {
      visit: {
        id,
        uuid,
        patientName: patient_name,
        recipientName: recipient_name,
        recipientNumber: recipient_number,
        recipientEmail: recipient_email,
        callTime: call_time,
        departmentId: department_id,
        status,
      },
      error: null,
    };
  } catch (error) {
    logger.error(`Error retrieving scheduled call with id ${callId}: ${error}`);
    return {
      visit: null,
      error: error.toString(),
    };
  }
};

export default retrieveScheduledCallByIdGateway;
