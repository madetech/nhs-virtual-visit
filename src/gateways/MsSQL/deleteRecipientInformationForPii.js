import moment from "moment";
import logger from "../../../logger";

const deleteRecipientInformationForPiiGateway = ({ getMsSqlConnPool}) => async ({ callId }) => {
  logger.info(`Deleting recipient data for call ${callId}`);

  try {
    const db = await getMsSqlConnPool();
    const timestamp = moment().utc().toISOString();
    const response = await db
      .request()
      .input("callId", callId)
      .input("patientName", null)
      .input("clearOutTime", timestamp)
      .input("recipientName", null)
      .input("recipientNumber", null)
      .input("recipientEmail", null)
      .query(
        `UPDATE dbo.[scheduled_call] 
          SET patient_name = @patientName, pii_cleared_out = @clearOutTime, recipient_name = @recipientName,
            recipient_number = @recipientNumber, recipient_email = @recipientEmail
          OUTPUT inserted.*
          WHERE id = @callId
        `
      );

      if (response.rowsAffected[0] !== 0) {
        logger.info(`${response}, success=true`, response);
        return {
          success: true,
          error: null,
        };
      }

      logger.error(`Error: ${callId} could not be found in the database`);
      return {
        success: false,
        error: "Call could not be found in the database",
      };
  } catch (error) {
    logger.error(`There was an error deleting recipient data for call ${callId}: ${JSON.stringify(error)}`);
    return {
      success: false,
      error: error.toString(),
    };
  }
};

export default deleteRecipientInformationForPiiGateway;

