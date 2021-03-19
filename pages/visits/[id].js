import React, { useCallback, useEffect } from "react";
import Layout from "../../src/components/Layout";
import Whereby from "../../src/components/Whereby";
import Error from "next/error";
import propsWithContainer from "../../src/middleware/propsWithContainer";
import fetch from "isomorphic-unfetch";
import { v4 as uuidv4 } from "uuid";
import { JOIN_VISIT, LEAVE_VISIT } from "../../src/helpers/eventActions";

const Call = ({
  visitId,
  callId,
  callPassword,
  callSessionId,
  name,
  error,
  wherebySubdomain,
}) => {
  if (error) {
    return <Error />;
  }

  const captureEvent = async (action) => {
    const body = {
      action: action,
      visitId: visitId,
      callSessionId: callSessionId,
      callId,
      callPassword,
    };

    await fetch("/api/capture-event", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
  };

  const completeVisit = async () => {
    await fetch("/api/complete-visit", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ callUuid: callId }),
    });
  };

  useEffect(() => {
    captureEvent(JOIN_VISIT);
  }, []);

  const leaveVisit = useCallback(async () => {
    await captureEvent(LEAVE_VISIT);
    await completeVisit();
  });

  return (
    <Layout title="Virtual visit" isBookService={false} mainStyleOverride>
      <Whereby
        callId={callId}
        displayName={name}
        onEnd={leaveVisit}
        wherebySubdomain={wherebySubdomain}
      />
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  async ({ req: { headers }, query, container }) => {
    const { id: callId, name, callPassword } = query;

    const verifyCallPassword = container.getVerifyCallPassword();
    const userIsAuthenticated = container.getUserIsAuthenticated();
    const retrieveVisitByCallId = container.getRetrieveVisitByCallId();

    const { validCallPassword } = await verifyCallPassword(
      callId,
      callPassword
    );

    const authenticationToken = await userIsAuthenticated(headers.cookie);

    if (validCallPassword || authenticationToken) {
      const { visit: scheduledCall, error } = await retrieveVisitByCallId(
        callId
      );
      const callSessionId = uuidv4();
      const visitId = scheduledCall.id;

      return {
        props: {
          visitId,
          callId,
          callPassword: callPassword || "",
          callSessionId,
          name,
          error,
          wherebySubdomain: process.env.WHEREBY_SUBDOMAIN || null,
        },
      };
    } else {
      return { props: { error: "Unauthorized" } };
    }
  }
);

export default Call;
