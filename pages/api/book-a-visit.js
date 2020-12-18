import withContainer from "../../src/middleware/withContainer";
import {
  createVisit,
  retrieveWardById,
  retrieveTrustById,
  CallIdProvider,
  RandomIdProvider,
} from "../../src/containers/CreateVisitContainer";
import sendTextMessage from "../../src/usecases/sendTextMessage";
import sendEmail from "../../src/usecases/sendEmail";
import sendBookingNotification from "../../src/usecases/sendBookingNotification";
import createVisitUnitOfWork from "../../src/gateways/UnitsOfWork/createVisitUnitOfWork";
import GovNotify from "../../src/gateways/GovNotify";
import {
  validateHttpMethod,
  checkIfAuthorised,
} from "../../src/helpers/apiErrorHandler";

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    validateHttpMethod("POST", method, res);

    const userIsAuthenticatedInstance = container.getUserIsAuthenticated();
    const userIsAuthenticatedResponse = await userIsAuthenticatedInstance(
      headers.cookie
    );

    checkIfAuthorised(userIsAuthenticatedResponse, res);

    let { wardId, trustId } = userIsAuthenticatedResponse;
    if (!trustId) {
      res.status(400);
      res.end(JSON.stringify({ err: "no trustId" }));
      return;
    }
    if (!wardId) {
      res.status(400);
      res.end(JSON.stringify({ err: "no wardId" }));
      return;
    }

    res.setHeader("Content-Type", "application/json");

    const { trust, error: trustErr } = await retrieveTrustById(trustId);

    if (trustErr) {
      res.status(400);
      res.end(JSON.stringify({ trustErr }));
      return;
    }

    const { ward, error: wardErr } = await retrieveWardById(wardId, trustId);
    if (wardErr) {
      res.status(400);
      res.end(JSON.stringify({ wardErr }));
      return;
    }

    const randomIdProvider = new RandomIdProvider();
    const callPassword = randomIdProvider.generate(10);
    const provider = new CallIdProvider(trust.videoProvider, body.callTime);
    const callId = await provider.generate();

    const getNotifyClient = () => {
      return GovNotify.getInstance();
    };
    const getSendTextMessage = () => {
      return sendTextMessage({ getNotifyClient });
    };
    const getSendEmail = () => {
      return sendEmail({ getNotifyClient });
    };

    const sendBookingNotificationInstance = sendBookingNotification({
      getSendTextMessage,
      getSendEmail,
    });

    const createVisitUnitOfWorkInstance = createVisitUnitOfWork(
      sendBookingNotificationInstance
    );
    const createVisitInstance = createVisit(createVisitUnitOfWorkInstance);

    try {
      const { success, err } = await createVisitInstance(
        {
          patientName: body.patientName,
          contactEmail: body.contactEmail,
          contactNumber: body.contactNumber,
          contactName: body.contactName,
          callTime: body.callTime,
          callTimeLocal: body.callTimeLocal,
        },
        ward,
        callId,
        callPassword,
        trust.videoProvider
      );

      if (!success) {
        res.status(400);
        res.end(JSON.stringify({ err }));
        return;
      }

      res.status(201);
      res.end(JSON.stringify({ success: true }));
    } catch (err) {
      console.error(err);
      res.status(500);
      res.end(JSON.stringify({ err: "Failed to schedule a visit" }));
    }
  }
);
