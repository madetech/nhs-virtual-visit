import React from "react";
import { mount } from "enzyme";
import Call from "./[id]";

describe("call", () => {
  it("configures Jitsi toolbar buttons", () => {
    const spy = jest.fn();

    window.JitsiMeetExternalAPI = spy;

    const wrapper = mount(<Call />);

    expect(spy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: ["microphone", "camera", "hangup"],
        },
      })
    );
  });
});
