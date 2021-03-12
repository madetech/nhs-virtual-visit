const deleteRecipientInformationForPii = ({ getDeleteRecipientInformationForPiiGateway }) => async ({
  clearOutTime
}) => {
  if (!clearOutTime) {
    return {
      success: false,
      message: "clearOutTime is not defined",
      error: true,
    };
  }

  const deleteRecipientInformationForPiiGateway = getDeleteRecipientInformationForPiiGateway();
  const { success, message, error } = await deleteRecipientInformationForPiiGateway({ clearOutTime });
  
  return { success, message, error };
}

export default deleteRecipientInformationForPii;
