import uuidValidate from "uuid-validate";
import TemplateStore from "../src/gateways/GovNotify/TemplateStore";

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

  _validatePersonalisation = (templateId, personalisation) => {
    const template = Object.values(TemplateStore).filter(
      (it) => it.templateId === templateId
    )[0];

    return template.personalisationKeys.filter(
      (key) => Object.keys(personalisation).indexOf(key) === -1
    );
  };

  sendSms = jest.fn((templateId, mobileNumber, { personalisation }) => {
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

    if (mobileNumber.length !== 11) {
      return this._rejectWithError({
        error: "ValidationError",
        message: "phone_number Not enough digits",
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

    return Promise.resolve({
      id: "test-sms-return-response-id",
    });
  });

  sendEmail = jest.fn(() => {});
}
