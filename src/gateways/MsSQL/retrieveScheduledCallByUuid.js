import logger from "../../../logger";

export default ({ getMsSqlConnPool }) => async (callUuid) => {
  const db = await getMsSqlConnPool();
  try {
    logger.info(`Retrieving scheduled call with uuid ${callUuid}`);
    const res = await db
      .request()
      .input("uuid", callUuid)
      .query("SELECT * FROM dbo.[scheduled_call] WHERE [uuid] = @uuid");
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
    } = res.recordset[0];
    return {
      error: null,
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
    };
  } catch (error) {
    logger.error(`Error retrieving scheduled call: ${error}`);
    return {
      visit: null,
      error: error.toString(),
    };
  }
};
