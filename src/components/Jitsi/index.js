import React, { useEffect } from "react";
import useScript from "../../../src/hooks/useScript";
import Router from "next/router";

const Jitsi = ({ callId, name, onEnd }) => {
  const [jitsiLoaded] = useScript("https://meet.jit.si/external_api.js");

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

    if (name) {
      api.executeCommand("displayName", name);
      api.on("readyToClose", () => {
        onEnd();
        Router.push(`/visits/end?callId=${callId}`);
      });
    }
  }, [jitsiLoaded]);

  if (callId) {
    return <div id="meet" style={{ height: "calc(100vh - 195px)" }}></div>;
  } else {
    return (
      <div>
        <h1>No calling code provided</h1>
        <p>Please use the link provided in the message you received.</p>
      </div>
    );
  }
};

export default Jitsi;
