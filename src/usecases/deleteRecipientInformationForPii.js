const deleteRecipientInformationForPii = ({ getDeleteRecipientInformationForPiiGateway }) => async ({
  callId
}) => {
  if (!callId) {
    return {
      success: false,
      error: "callId is not defined",
    };
  }

  const deleteRecipientInformationForPiiGateway = getDeleteRecipientInformationForPiiGateway();
  const { success, error } = await deleteRecipientInformationForPiiGateway({ callId });

  return { success, error };
}

export default deleteRecipientInformationForPii;
