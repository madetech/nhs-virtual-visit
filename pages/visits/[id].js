import React, { useEffect, useState } from "react";
import Layout from "../../src/components/Layout";
import useScript from "../../src/hooks/useScript";

const Call = ({ id, name }) => {
  if (true /* Needs to check process.env.WHEREBY_SPIKE, not sure how */) {
    return (
      <Layout>
        <main>
          <Whereby id={id} />
        </main>
      </Layout>
    );
  } else {
    const [jitsiLoaded, error] = useScript("https://meet.jit.si/external_api.js");

    useEffect(() => {
      if (!jitsiLoaded) {
        console.log("no lib");
        return;
      }

      if (!id) {
        console.log("no id");
        return;
      }

      const domain = "meet.jit.si";
      const options = {
        roomName: id,
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
      }
  }, [jitsiLoaded]);

    if (!id) {
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

export const getServerSideProps = ({ query }) => {
  const { id, name } = query;
  return { props: { id, name } };
};

const Whereby = ({ id }) => (
  <iframe
    style={{
      width: "100%",
      height: "calc(100vh - 135px)",
      border: 0,
    }}
    src={`https://${process.env.WHEREBY_SUBDOMAIN}.whereby.com/${id}?embed&iframeSource=${process.env.WHEREBY_SUBDOMAIN}&background=off&displayName=Ward&screenshare=off&chat=off`}
    allow="camera; microphone; fullscreen; speaker"
  ></iframe>
);

export default Call;
