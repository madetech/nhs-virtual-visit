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

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    if (method !== "POST") {
      res.status(406);
      res.end();
      return;
    }

    const userIsAuthenticatedInstance = container.getUserIsAuthenticated();
    // ^^ still using container here for now because it has dependencies passed in via its constructor (reliant on app container)
    const userIsAuthenticatedResponse = await userIsAuthenticatedInstance(
      headers.cookie
    );

    if (!userIsAuthenticatedResponse) {
      res.status(401);
      res.end(JSON.stringify({ err: "Unauthorized" }));
      return;
    }
    let { wardId, trustId } = userIsAuthenticatedResponse;
    if (!trustId) {
      res.status(400);
      res.end(JSON.stringify({ err: "no trustId" }));
    }
    if (!wardId) {
      res.status(400);
      res.end(JSON.stringify({ err: "no wardId" }));
    }

    res.setHeader("Content-Type", "application/json");

    const getNotifyClient = () => {
      return GovNotify.getInstance();
    };
    const getSendTextMessage = () => {
      return sendTextMessage({ getNotifyClient });
    };
    const getSendEmail = () => {
      return sendEmail({ getNotifyClient });
    };
    //  ^^ better way to handle this? dont want to change sendBookingnotification constructor bcos it's used elsewhere by update visit

    const sendBookingNotificationTest = sendBookingNotification({
      getSendTextMessage,
      getSendEmail,
    });

    try {
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

      const createVisitUnitOfWorkInstance = createVisitUnitOfWork(
        sendBookingNotificationTest
      );
      const createVisitInstance = createVisit(createVisitUnitOfWorkInstance);

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
