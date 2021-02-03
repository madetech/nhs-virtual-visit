import logger from "../../../logger";
export default ({ getMsSqlConnPool }) => async ({
  id,
  patientName,
  recipientName,
  recipientEmail,
  recipientNumber,
  callTime,
}) => {
  logger.info(`updating visit details, visit id: ${id}`);
  try {
    const db = await getMsSqlConnPool();
    const res = await db
      .request()
      .input("id", id)
      .input("patient_name", patientName)
      .input("call_time", callTime)
      .input("recipient_name", recipientName)
      .input("recipient_number", recipientNumber)
      .input("recipient_email", recipientEmail)
      .query(
        `UPDATE dbo.[scheduled_call] SET patient_name = @patient_name, call_time = @call_time, recipient_name = @recipient_name, recipient_number = @recipient_number, recepient_email = @recipient_email OUTPUT inserted.* WHERE id = @id`
      );

    return {
      visit: res.recordset[0],
      error: null,
    };
  } catch (error) {
    return {
      visit: null,
      error: error.toString(),
    };
  }
};
