const sendEmail = ({ getNotifyClient }) => async (
  templateId,
  emailAddress,
  personalisation,
  reference
) => {
  const notifyClient = await getNotifyClient();

  try {
    await notifyClient.sendEmail(templateId, emailAddress, {
      personalisation: personalisation,
      reference: reference,
    });

    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: `GovNotify error occurred: ${error?.error?.errors[0]?.message}`,
    };
  }
};

export default sendEmail;
