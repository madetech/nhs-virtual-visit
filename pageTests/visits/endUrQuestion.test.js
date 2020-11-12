//import React from "react";
//import { render, queryByAttribute } from "@testing-library/react";
//import EndUrQuestion from "../../pages/visits/endUrQuestion";
import { getServerSideProps } from "../../pages/visits/endUrQuestion";

describe("end UR question", () => {
  beforeAll(() => {
    process.env.UR_QUESTION = true;
  });

  afterAll(() => {
    process.env.UR_QUESTION = false;
  });

  describe("getServerSideProps", () => {
    it("redirects to the end screen for staff members", async () => {
      //If there is a wardId we're a staff member
      const container = {
        getUserIsAuthenticated: () =>
          jest.fn().mockResolvedValue({ ward: "test-ward-id" }),
      };
      const res = {
        writeHead: jest.fn().mockReturnValue({ end: () => {} }),
        status: jest.fn(),
      };
      const req = {
        headers: {},
      };

      const callId = "112";
      await getServerSideProps({ req, query: { callId }, res, container });

      expect(res.writeHead).toHaveBeenCalledWith(302, {
        Location: `/visits/end?callId=${callId}`,
      });
    });

    it("does not redirect to the end screen for key contacts", async () => {
      const container = {
        getUserIsAuthenticated: () => jest.fn().mockResolvedValue({}),
      };
      const res = {
        writeHead: jest.fn().mockReturnValue({ end: () => {} }),
        status: jest.fn(),
      };
      const req = {
        headers: {},
      };

      const callId = "112";
      await getServerSideProps({ req, query: { callId }, res, container });

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
