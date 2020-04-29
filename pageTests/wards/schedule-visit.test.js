import { getServerSideProps } from "../../pages/wards/[id]/schedule-visit";

// TODO: This needs to be moved once the verifyToken logic is in the container..
jest.mock("../../src/usecases/userIsAuthenticated", () => () => (token) =>
  token && { ward: "123" }
);

describe("ward/[id]/schedule-visit", () => {
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

    describe("with no extra parameters", () => {
      it("provides the visit records from the database", async () => {
        const container = {
          getDb: () =>
            Promise.resolve({
              any: () => [{ id: 1 }, { id: 2 }],
            }),
        };

        const { props } = await getServerSideProps({
          req: authenticatedReq,
          res,
          query: {},
          container,
        });
        expect(res.writeHead).not.toHaveBeenCalled();
        expect(props.id).toEqual("123");
      });
    });

    describe("returning from schedule-confirmation", () => {
      it("provides the form data from query params", async () => {
        const query = {
          patientName: "Patient Name",
          contactName: "Visitor Name",
          contactNumber: "07123456789",
          day: "4",
          month: "12",
          year: "2020",
          hour: "13",
          minute: "44",
        };

        const { props } = await getServerSideProps({
          req: authenticatedReq,
          res,
          query,
          container: {},
        });

        expect(props).toMatchObject(
          expect.objectContaining({
            initialPatientName: query.patientName,
            initialContactName: query.contactName,
            initialContactNumber: query.contactNumber,
            initialCallDateTime: {
              day: query.day,
              month: query.month,
              year: query.year,
              hour: query.hour,
              minute: query.minute,
            },
          })
        );
      });
    });

    describe("with rebookCallId parameter", () => {
      it("provides the visit records from the database", async () => {
        const container = {
          getDb: () =>
            Promise.resolve({
              any: () => [
                {
                  id: 1,
                  patient_name: "Fred Bloggs",
                  recipient_name: "John Doe",
                  recipient_number: "07001231234",
                  call_time: new Date(),
                  call_id: "Test",
                  provider: "Test",
                },
              ],
            }),
        };

        const { props } = await getServerSideProps({
          req: authenticatedReq,
          res,
          query: {
            rebookCallId: "cat-meow",
          },
          container,
        });
        expect(res.writeHead).not.toHaveBeenCalled();
        expect(props.id).toEqual("123");
        expect(props.initialPatientName).toEqual("Fred Bloggs");
        expect(props.initialContactName).toEqual("John Doe");
        expect(props.initialContactNumber).toEqual("07001231234");
      });
    });
  });
});
