const sendTextMessage = ({ getNotifyClient }) => async (
  templateId,
  phoneNumber,
  personalisation,
  reference
) => {
  const notifyClient = getNotifyClient();

  try {
    await notifyClient.sendSms(
      templateId,
      phoneNumber,
      personalisation,
      reference
    );

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error };
  }
};

export default sendTextMessage;
