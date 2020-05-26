import TemplateStore from "../../gateways/GovNotify/TemplateStore";
import fillObjectWithStrings from "../../testUtils/fillObjectWithStrings";

const { NotifyClient: RealNotifyClient } = jest.requireActual(
  "notifications-node-client"
);
const { NotifyClient: FakeNotifyClient } = jest.requireMock(
  "notifications-node-client"
);

const contractTestClient = (testCallback) => () => {
  const apiKey = process.env.API_KEY;
  const clients = [
    {
      label: "Real",
      client: new RealNotifyClient(apiKey),
    },
    {
      label: "Fake",
      client: new FakeNotifyClient(),
    },
  ];

  clients.forEach(({ label, client }) => {
    describe(`with a ${label} GovNotify client`, () => {
      testCallback({ label, client });
    });
  });
};

describe(
  "GovNotify contract sms tests",
  contractTestClient(({ client }) => {
    const { templateId, personalisationKeys } = TemplateStore.firstText;

    const personalisation = fillObjectWithStrings(personalisationKeys);

    const validMobileNumber = "07700900000";

    describe("sendSms", () => {
      it("Can successfully send an SMS", async () => {
        const result = await client.sendSms(templateId, validMobileNumber, {
          personalisation,
        });

        expect(result).toBeDefined;
        expect(result.response).toBeDefined;
      });

      it("rejects an invalid mobile number", async () => {
        await expect(
          client.sendSms(templateId, "070", {
            personalisation,
          })
        ).rejects.toMatchObject(
          buildError({
            error: "ValidationError",
            message: "phone_number Not enough digits",
          })
        );
      });

      it("rejects when personalisation is missing", async () => {
        await expect(
          client.sendSms(templateId, validMobileNumber, {
            personalisation: {
              hospital_name: "Test Hopsital",
            },
          })
        ).rejects.toMatchObject(
          buildError({
            error: "BadRequestError",
            message: expect.stringMatching(
              /Missing personalisation: ward_name, visit_date, visit_time/
            ),
          })
        );
      });

      it("rejects when templateId is an invalid UUID", async () => {
        await expect(
          client.sendSms("", validMobileNumber, {
            personalisation: {},
          })
        ).rejects.toMatchObject(
          buildError({
            error: "ValidationError",
            message: "template_id is not a valid UUID",
          })
        );
      });

      it("rejects when templateId does not match a template", async () => {
        await expect(
          client.sendSms(
            "3b45757d-aaaa-4e33-ac7c-00674a70888d",
            validMobileNumber,
            {
              personalisation: {},
            }
          )
        ).rejects.toMatchObject(
          buildError({
            error: "BadRequestError",
            message: "Template not found",
          })
        );
      });
    });
  })
);

describe(
  "GovNotify contract email tests",
  contractTestClient(({ client }) => {
    const { templateId, personalisationKeys } = TemplateStore.firstEmail;

    const personalisation = fillObjectWithStrings(personalisationKeys);

    const validEmailAddress = "simulate-delivered@notifications.service.gov.uk";

    xdescribe("sendEmail", () => {
      it("Can successfully send an Email", async () => {
        const result = await client.sendEmail(templateId, validEmailAddress, {
          personalisation,
        });

        expect(result).toBeDefined;
        expect(result.response).toBeDefined;
      });
    });
  })
);

const buildError = ({ error, message }) => ({
  error: {
    errors: [
      {
        error,
        message,
      },
    ],
  },
});
