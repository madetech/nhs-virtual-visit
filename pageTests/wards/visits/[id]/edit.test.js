import { getServerSideProps } from "../../../../pages/wards/visits/[id]/edit";

describe("wards/visits/[id]/edit", () => {
  describe("getServerSideProps", () => {
    it("redirects to login page if not authenticated", async () => {
      const anonymousReq = {
        headers: {
          cookie: "",
        },
      };

      const res = {
        writeHead: jest.fn().mockReturnValue({ end: () => {} }),
      };

      await getServerSideProps({ req: anonymousReq, res });

      expect(res.writeHead).toHaveBeenCalledWith(302, {
        Location: "/wards/login",
      });
    });

    it("retrieves a visit", async () => {
      const callTime = new Date(2020, 1, 1, 15, 0);

      const retrieveVisitByCallId = jest.fn().mockResolvedValue({
        scheduledCall: {
          id: "1",
          patientName: "Bob Smith",
          recipientName: "John Smith",
          recipientEmail: "john.smith@example.com",
          recipientNumber: "07123456789",
          callTime,
          callId: "callId",
        },
        error: null,
      });

      const container = {
        getUserIsAuthenticated: () => () => true,
        getRetrieveWardById: () => () => ({ error: null }),
        getTokenProvider: () => ({
          validate: jest.fn(() => ({
            type: "wardStaff",
            wardId: 123,
            trustId: 10,
          })),
        }),
        getRetrieveVisitByCallId: () => retrieveVisitByCallId,
      };

      const { props } = await getServerSideProps({
        req: {
          headers: {
            cookie: "token=123",
          },
        },
        query: { id: "callId" },
        container,
      });

      expect(props).toEqual({
        callId: "callId",
        initialPatientName: "Bob Smith",
        initialContactName: "John Smith",
        initialContactNumber: "07123456789",
        initialContactEmail: "john.smith@example.com",
        initialCallDateTime: {
          day: 1,
          month: 1,
          year: 2020,
          hour: 15,
          minute: 0,
        },
      });
      expect(retrieveVisitByCallId).toBeCalledWith("callId");
    });
  });
});
