import logger from "../../../logger";
import { statusToId, ARCHIVED } from "../../../src/helpers/visitStatus";

const deleteRecipientInformationForPiiGateway = ({ getMsSqlConnPool}) => async ({ clearOutTime }) => {
  logger.info(`Deleting recipient data for calls that have happened`);

  try {
    const db = await getMsSqlConnPool();
    const response = await db
      .request()
      .input("patientName", null)
      .input("clearOutTime", clearOutTime)
      .input("recipientName", null)
      .input("recipientNumber", null)
      .input("recipientEmail", null)
      .input("status", statusToId(ARCHIVED))
      .query(
        `UPDATE dbo.[scheduled_call] 
          SET patient_name = @patientName, pii_cleared_out = @clearOutTime, recipient_name = @recipientName,
            recipient_number = @recipientNumber, recipient_email = @recipientEmail, status = @status
          WHERE call_time < @clearOutTime AND (patient_name IS NOT NULL 
            OR recipient_name IS NOT NULL OR recipient_number IS NOT NULL 
            OR recipient_email IS NOT NULL)
        `
      );

    const affectedRows = response.rowsAffected[0];
    if (affectedRows !== 0) {
      let scheduledCallMessage;
      affectedRows === 1 ? 
        scheduledCallMessage = `${affectedRows} scheduled call has` :
        scheduledCallMessage = `${affectedRows} scheduled calls have`;
      
      logger.info(`${scheduledCallMessage} had recipient data cleared, success=true`);
  
      return {
        success: true,
        message: `${scheduledCallMessage} had recipient data cleared`,
        error: null
      };
    }

    logger.info(`There were no calls that required recipient data clearing`);
    return {
      success: true,
      message: "There were no calls that required recipient data clearing",
      error: null,
    };
  } catch (error) {
    logger.error(`There was an error clearing recipient data for calls: ${error}`);
    return {
      success: false,
      message: "There was an error clearing recipient data for calls",
      error: error.toString(),
    };
  }
};

export default deleteRecipientInformationForPiiGateway;

