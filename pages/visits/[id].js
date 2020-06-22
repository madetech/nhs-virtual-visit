import React, { useCallback, useEffect } from "react";
import Layout from "../../src/components/Layout";
import Jitsi from "../../src/components/Jitsi";
import Whereby from "../../src/components/Whereby";
import Error from "next/error";
import propsWithContainer from "../../src/middleware/propsWithContainer";
import fetch from "isomorphic-unfetch";
import { v4 as uuidv4 } from "uuid";

const Call = ({ visitId, callId, sessionId, name, provider, error }) => {
  if (error) {
    return <Error />;
  }

  const captureEvent = async (action) => {
    const body = {
      action: action,
      visitId: visitId,
      sessionId: sessionId,
    };

    await fetch("/api/capture-event", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
  };

  useEffect(() => {
    captureEvent("join-visit");
  }, []);

  const leaveVisit = useCallback(async () => {
    await captureEvent("leave-visit");
  });

  return (
    <Layout title="Virtual visit" isBookService={false} mainStyleOverride>
      {provider === "whereby" ? (
        <Whereby callId={callId} displayName={name} onEnd={leaveVisit} />
      ) : (
        <Jitsi callId={callId} name={name} onEnd={leaveVisit} />
      )}
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  async ({ req: { headers }, res, query, container }) => {
    const { id: callId, name, callPassword } = query;

    const verifyCallPassword = container.getVerifyCallPassword();
    const userIsAuthenticated = container.getUserIsAuthenticated();
    const retrieveVisitByCallId = container.getRetrieveVisitByCallId();

    const { validCallPassword } = await verifyCallPassword(
      callId,
      callPassword
    );
    const authenticationToken = userIsAuthenticated(headers.cookie);

    if (validCallPassword || authenticationToken) {
      const { scheduledCall, error } = await retrieveVisitByCallId(callId);
      const provider = scheduledCall.provider;
      const sessionId = uuidv4();
      const visitId = scheduledCall.id;

      return { props: { visitId, callId, sessionId, name, provider, error } };
    } else {
      res.writeHead(307, {
        Location: "/error",
      });
      res.end();

      return { props: {} };
    }
  }
);

export default Call;
