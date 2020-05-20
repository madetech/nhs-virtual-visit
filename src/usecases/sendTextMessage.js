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
    console.log(error);
    return {
      success: false,
      error: `GovNotify error occurred: ${error?.error?.errors[0]?.message}`,
    };
  }
};

export default sendTextMessage;
