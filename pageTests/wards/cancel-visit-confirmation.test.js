import { getServerSideProps } from "../../pages/wards/cancel-visit-confirmation";

// TODO: This needs to be moved once the verifyToken logic is in the container..
jest.mock("../../src/usecases/userIsAuthenticated", () => () => (token) =>
  token && { ward: "123" }
);

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
                  recipient_number: "07001231234",
                  call_time: new Date("2020-04-20 17:20:00"),
                  call_id: "Test-Call-Id",
                  provider: "Test",
                },
              ],
            }),
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
        expect(props.callDate).toEqual("20 April 2020");
        expect(props.callId).toEqual("Test-Call-Id");
        expect(props.patientName).toEqual("Fred Bloggs");
        expect(props.contactName).toEqual("John Doe");
        expect(props.contactNumber).toEqual("07001231234");
        expect(props.callDate).toEqual("20 April 2020");
        expect(props.callTime).toEqual("17:20");
      });
    });
  });
});
