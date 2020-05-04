const sendTextMessage = ({ getNotifyClient }) => async (
  templateId,
  phoneNumber,
  personalisation,
  reference
) => {
  const notifyClient = await getNotifyClient();

  try {
    await notifyClient.sendSms(templateId, phoneNumber, {
      personalisation: personalisation,
      reference: reference,
    });

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error };
  }
};

export default sendTextMessage;
