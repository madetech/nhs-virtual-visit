export default ({ getMsSqlConnPool, logger }) => async ({
  callId,
  patientName,
  recipientName,
  recipientEmail,
  recipientNumber,
  callTime,
}) => {
  logger.info(`updating visit details, visit id: ${callId}`);
  try {
    const db = await getMsSqlConnPool();
    const res = await db
      .request()
      .input("id", callId)
      .input("patient_name", patientName)
      .input("call_time", callTime)
      .input("recipient_name", recipientName)
      .input("recipient_number", recipientNumber)
      .input("recipient_email", recipientEmail)
      .query(
        `UPDATE dbo.[scheduled_call] SET patient_name = @patient_name, call_time = @call_time, recipient_name = @recipient_name, recipient_number = @recipient_number, recipient_email = @recipient_email OUTPUT inserted.* WHERE id = @id`
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
    } = res.recordset[0];
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
    return {
      visit: null,
      error: error.toString(),
    };
  }
};
