import React, { useEffect, useState } from "react";
import Layout from "../../src/components/Layout";
import Error from "next/error";
import useScript from "../../src/hooks/useScript";
import Router from "next/router";
import propsWithContainer from "../../src/middleware/propsWithContainer";
import retrieveVisitByCallId from "../../src/usecases/retrieveVisitByCallId";

const Call = ({ callId, name, provider, error }) => {
  if (error) {
    return <Error />;
  }

  if (provider === "whereby") {
    return (
      <Layout mainStyleOverride>
        <main>
          <Whereby id={callId} name={name} />
          <button
            className="nhsuk-button"
            style={{ margin: "0 30%", width: "40%" }}
            type="submit"
            onClick={() => {
              Router.push(`/visits/end?callId=${callId}`);
            }}
          >
            End call
          </button>
        </main>
      </Layout>
    );
  } else {
    const [jitsiLoaded, error] = useScript(
      "https://meet.jit.si/external_api.js"
    );

    useEffect(() => {
      if (!jitsiLoaded) {
        return;
      }

      if (!callId) {
        return;
      }

      const domain = "meet.jit.si";
      const options = {
        roomName: callId,
        width: "100%",
        height: "100%",
        parentNode: document.querySelector("#meet"),
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: ["microphone", "camera", "hangup"],
        },
      };

      const api = new window.JitsiMeetExternalAPI(domain, options);

      if (!!name) {
        api.executeCommand("displayName", name);
        api.on("videoConferenceLeft", () => {
          Router.push(`/visits/end?callId=${callId}`);
        });
      }
    }, [jitsiLoaded]);

    if (!callId) {
      return (
        <Layout>
          <h1>No calling code provided</h1>
          <p>Please use the link provided in the message you received.</p>
        </Layout>
      );
    }

    return (
      <Layout>
        <main>
          <div id="meet"></div>
        </main>
      </Layout>
    );
  }
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

      return { props: { callId, name, provider, error } };
    } else {
      res.writeHead(307, {
        Location: "/error",
      });
      res.end();
    }
  }
);

const Whereby = ({ id, name }) => (
  <iframe
    style={{
      width: "100%",
      height: "calc(100vh - 195px)",
      border: 0,
    }}
    src={`https://${process.env.WHEREBY_SUBDOMAIN}.whereby.com/${id}?embed&iframeSource=${process.env.WHEREBY_SUBDOMAIN}&background=off&displayName=${name}&screenshare=off&chat=off`}
    allow="camera; microphone; fullscreen; speaker"
  ></iframe>
);

export default Call;
