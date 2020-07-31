import { getServerSideProps } from "../../pages/wards/cancel-visit-confirmation";

describe("ward/cancel-visit-confirmation", () => {
  const anonymousReq = {
    headers: {
      cookie: "",
    },
  };

  const authenticatedReq = {
    headers: {
      cookie: "token=123",
    },
  };
  let res;

  const tokenProvider = {
    validate: jest.fn(() => ({ type: "wardStaff", wardId: 123 })),
  };

  beforeEach(() => {
    res = {
      writeHead: jest.fn().mockReturnValue({ end: () => {} }),
    };
  });

  describe("getServerSideProps", () => {
    it("redirects to login page if not authenticated", async () => {
      await getServerSideProps({ req: anonymousReq, res });

      expect(res.writeHead).toHaveBeenCalledWith(302, {
        Location: "/wards/login",
      });
    });
    it("provides an error if a db error occurs", async () => {
      const container = {
        getDb: () =>
          Promise.resolve({
            any: () => {
              throw new Error("Some DB Error");
            },
          }),
        getTokenProvider: () => tokenProvider,
        getRegenerateToken: () => jest.fn().mockReturnValue({}),
        getRetrieveWardById: () => jest.fn().mockReturnValue({}),
      };

      const { props } = await getServerSideProps({
        req: authenticatedReq,
        res,
        query: {},
        container,
      });

      expect(props.error).not.toBeNull();
    });

    describe("with callId parameter", () => {
      it("provides the visit record from the database", async () => {
        const container = {
          getDb: () =>
            Promise.resolve({
              any: () => [
                {
                  id: 1,
                  patient_name: "Fred Bloggs",
                  recipient_name: "John Doe",
                  recipient_number: "07700900900",
                  recipient_email: "john@example.com",
                  call_time: new Date("2020-04-15T23:00:00.000Z"),
                  call_id: "Test-Call-Id",
                  provider: "Test",
                },
              ],
            }),
          getTokenProvider: () => tokenProvider,
          getRegenerateToken: () => jest.fn().mockReturnValue({}),
          getRetrieveWardById: () => jest.fn().mockReturnValue({}),
        };

        const { props } = await getServerSideProps({
          req: authenticatedReq,
          res,
          query: {
            callId: "Test-Call-Id",
          },
          container,
        });
        expect(res.writeHead).not.toHaveBeenCalled();
        expect(props.callId).toEqual("Test-Call-Id");
        expect(props.patientName).toEqual("Fred Bloggs");
        expect(props.contactName).toEqual("John Doe");
        expect(props.contactNumber).toEqual("07700900900");
        expect(props.contactEmail).toEqual("john@example.com");
        expect(props.callDateAndTime).toEqual("2020-04-15T23:00:00.000Z");
      });
    });
  });
});
