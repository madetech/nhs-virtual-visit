import React from "react";

const Whereby = ({ callId, displayName }) => (
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
);

export default Whereby;
