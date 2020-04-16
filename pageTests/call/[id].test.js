import React from "react";
import { mount } from "enzyme";
import Call from "../pages/[id]";
import { RouterContext } from 'next/dist/next-server/lib/router-context'

describe("call", () => {
  let spy;
  beforeEach(() => {
    spy = jest.fn();

    window.JitsiMeetExternalAPI = spy;
  });

  describe('with a call id', () => {
    beforeEach(() => {
      const router = {
        pathname: "/calls/$id",
        route: "/calls/$id",
        query: { id: "TestCallId" },
        asPath: "/calls/TestCallId",
      };

      mount(
        <RouterContext.Provider value={router}>
          <Call />
        </RouterContext.Provider>
      );
    });

    it("configures Jitsi toolbar buttons", () => {
      expect(spy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: ["microphone", "camera", "hangup"],
          },
        })
      );
    });

    it("uses the call id as the room name", () => {
      expect(spy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          roomName: "TestCallId",
        })
      );
    });
  })

  describe('without a call id', () => {
    it("shows an error page", () => {
      const router = {
        pathname: "/calls/$id",
        route: "/calls/$id",
        query: { id: "" },
        asPath: "/calls",
      };

      mount(
        <RouterContext.Provider value={router}>
          <Call />
        </RouterContext.Provider>
      );

      expect(spy).not.toHaveBeenCalled();
    });
  })
});
