import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Whereby from "./index";

jest.mock("next/router");

describe("Whereby", () => {
  it("sets the source of the iframe with the subdomain", () => {
    const callId = "testCallId";
    const displayName = "Test McTest";

    render(
      <Whereby
        callId={callId}
        displayName={displayName}
        wherebySubdomain="test-subdomain"
      />
    );

    expect(screen.getByTestId("whereby")).toHaveAttribute(
      "src",
      "https://test-subdomain.whereby.com/testCallId?embed&iframeSource=test-subdomain&background=off&displayName=Test McTest&screenshare=off&chat=off"
    );
  });

  it("calls the onEnd function when the end call is clicked", () => {
    const callId = "testCallId";
    const displayName = "Test McTest";
    const onEnd = jest.fn();

    render(<Whereby callId={callId} displayName={displayName} onEnd={onEnd} />);

    fireEvent.click(screen.getByText(/End call/));

    expect(onEnd).toHaveBeenCalled();
  });
});
