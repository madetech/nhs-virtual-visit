import uuidValidate from "uuid-validate";
import TemplateStore from "../src/gateways/GovNotify/TemplateStore";
import validateEmailAddress from "../src/helpers/validateEmailAddress";

export class NotifyClient {
  _rejectWithError = ({ error, message }) => {
    return Promise.reject({
      error: {
        errors: [
          {
            error,
            message,
          },
        ],
      },
    });
  };

  _validateRequest = (templateId, personalisation) => {
    if (!uuidValidate(templateId)) {
      return this._rejectWithError({
        error: "ValidationError",
        message: "template_id is not a valid UUID",
      });
    }

    if (
      Object.values(TemplateStore).findIndex(
        (it) => it.templateId === templateId
      ) === -1
    ) {
      return this._rejectWithError({
        error: "BadRequestError",
        message: "Template not found",
      });
    }

    const missingPersonalisation = this._validatePersonalisation(
      templateId,
      personalisation
    );

    if (missingPersonalisation.length) {
      return this._rejectWithError({
        error: "BadRequestError",
        message: `Missing personalisation: ${missingPersonalisation.join(
          ", "
        )}`,
      });
    }
  };

  _validatePersonalisation = (templateId, personalisation) => {
    const template = Object.values(TemplateStore).filter(
      (it) => it.templateId === templateId
    )[0];

    return template.personalisationKeys.filter(
      (key) => Object.keys(personalisation).indexOf(key) === -1
    );
  };

  sendSms = (templateId, mobileNumber, { personalisation }) => {
    const requestValidationError = this._validateRequest(
      templateId,
      personalisation
    );

    if (requestValidationError) {
      return requestValidationError;
    }

    if (mobileNumber.length !== 11) {
      return this._rejectWithError({
        error: "ValidationError",
        message: "phone_number Not enough digits",
      });
    }

    return Promise.resolve({
      id: "test-sms-return-response-id",
    });
  };

  sendEmail = (templateId, emailAddress, { personalisation }) => {
    const requestValidationError = this._validateRequest(
      templateId,
      personalisation
    );

    if (requestValidationError) {
      return requestValidationError;
    }

    if (!validateEmailAddress(emailAddress)) {
      return this._rejectWithError({
        error: "ValidationError",
        message: "email_address Not a valid email address",
      });
    }

    return Promise.resolve({
      id: "740e5834-3a29-46b4-9a6f-16142fde533a",
    });
  };
}
