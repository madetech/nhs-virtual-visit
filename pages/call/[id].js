import React, { useEffect, useState } from "react";
import Layout from "../../src/components/Layout";
import useScript from "../../src/hooks/useScript";

const Call = ({ id, name }) => {
  useScript("https://meet.jit.si/external_api.js");

  useEffect(() => {
    if (!window.JitsiMeetExternalAPI) {
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
  });

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
};

export const getServerSideProps = ({ params }) => {
  const { id, name } = params;
  return { props: { id, name } };
};

export default Call;
