import TemplateStore from "../gateways/GovNotify/TemplateStore";
import { formatDateAndTime, formatDate, formatTime } from "../../src/helpers/formatDatesAndTimes";
import ConsoleNotifyProvider from "../providers/ConsoleNotifyProvider";

export const NEW_NOTIFICATION = "new";
export const UPDATED_NOTIFICATION = "updated";

const sendBookingNotification = ({
  getSendTextMessage,
  getSendEmail,
}) => async ({
  mobileNumber,
  emailAddress,
  wardName,
  hospitalName,
  visitDateAndTime,
  notificationType = NEW_NOTIFICATION,
}) => {
  const { textMessageTemplateId, emailTemplateId } = getTemplateIds(
    notificationType
  );

  const personalisation = {
    visit_date: formatDate(visitDateAndTime),
    visit_time: formatTime(visitDateAndTime),
    ward_name: wardName,
    hospital_name: hospitalName,
  };

  const sendMessage = getSendTextMessage();
  const sendEmail = getSendEmail();

  let textMessageError = null;

  if (mobileNumber) {
    const { error } = await sendMessage(
      textMessageTemplateId,
      mobileNumber,
      personalisation,
      null
    );

    textMessageError = error;
  }

  let emailError = null;

  if (emailAddress) {
    const { error } = await sendEmail(
      emailTemplateId,
      emailAddress,
      personalisation,
      null
    );

    emailError = error;
  }

  if (textMessageError || emailError) {
    return {
      success: false,
      errors: { textMessageError, emailError },
    };
  } else {
    const consoleNotifyProvider = new ConsoleNotifyProvider();
    consoleNotifyProvider.notify(formatDateAndTime(visitDateAndTime));

    return {
      success: true,
      errors: null,
    };
  }
};

const getTemplateIds = (notificationType) => {
  let textMessageTemplateId;
  let emailTemplateId;

  switch (notificationType) {
    case NEW_NOTIFICATION:
      textMessageTemplateId = TemplateStore().firstText.templateId;
      emailTemplateId = TemplateStore().firstEmail.templateId;
      break;
    case UPDATED_NOTIFICATION:
      textMessageTemplateId = TemplateStore().updatedVisitText.templateId;
      emailTemplateId = TemplateStore().updatedVisitEmail.templateId;
      break;
    default:
      throw `Unsupported notification type ${notificationType}`;
  }

  return { textMessageTemplateId, emailTemplateId };
};

export default sendBookingNotification;
