import React from "react";
import Router from "next/router";

const Whereby = ({ callId, displayName, onEnd }) => (
  <div>
    <iframe
      data-testid="whereby"
      style={{
        width: "100%",
        height: "calc(100vh - 195px)",
        border: 0,
      }}
      src={`https://${process.env.WHEREBY_SUBDOMAIN}.whereby.com/${callId}?embed&iframeSource=${process.env.WHEREBY_SUBDOMAIN}&background=off&displayName=${displayName}&screenshare=off&chat=off`}
      allow="camera; microphone; fullscreen; speaker"
    ></iframe>
    <button
      className="nhsuk-button"
      style={{ margin: "0 30%", width: "40%" }}
      type="submit"
      onClick={() => {
        onEnd();
        Router.push(`/visits/end?callId=${callId}`);
      }}
    >
      End call
    </button>
  </div>
);

export default Whereby;
