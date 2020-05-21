import { getServerSideProps } from "../../pages/wards/book-a-visit";

describe("ward/book-a-visit", () => {
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

    describe("with no extra parameters", () => {
      it("provides the visit records from the database", async () => {
        const container = {
          getDb: () =>
            Promise.resolve({
              any: () => [{ id: 1 }, { id: 2 }],
            }),
          getTokenProvider: () => tokenProvider,
          getRetrieveWardById: () => jest.fn().mockReturnValue({}),
        };

        await getServerSideProps({
          req: authenticatedReq,
          res,
          query: {},
          container,
        });
        expect(res.writeHead).not.toHaveBeenCalled();
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

        const container = {
          getTokenProvider: () => tokenProvider,
          getRetrieveWardById: () => jest.fn().mockReturnValue({}),
        };

        const { props } = await getServerSideProps({
          req: authenticatedReq,
          res,
          query,
          container: container,
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
                  recipient_number: "07700900900",
                  call_time: new Date(),
                  call_id: "Test",
                  provider: "Test",
                },
              ],
            }),
          getTokenProvider: () => tokenProvider,
          getRetrieveWardById: () => jest.fn().mockReturnValue({}),
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
        expect(props.initialPatientName).toEqual("Fred Bloggs");
        expect(props.initialContactName).toEqual("John Doe");
        expect(props.initialContactNumber).toEqual("07700900900");
      });

      it("defaults the re-booking date 1 day after the original", async () => {
        const originalBookingDate = new Date(2020, 1, 1);
        const container = {
          getDb: () =>
            Promise.resolve({
              any: () => [
                {
                  id: 1,
                  patient_name: "Fred Bloggs",
                  recipient_name: "John Doe",
                  recipient_number: "07700900900",
                  call_time: originalBookingDate,
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
        expect(props.initialCallDateTime.day).toEqual(2);
      });

      it("rolls around to the following year", async () => {
        const originalBookingDate = new Date(2020, 12, 31);
        const container = {
          getDb: () =>
            Promise.resolve({
              any: () => [
                {
                  id: 1,
                  patient_name: "Fred Bloggs",
                  recipient_name: "John Doe",
                  recipient_number: "07700900900",
                  call_time: originalBookingDate,
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
        expect(props.initialCallDateTime.year).toEqual(2021);
        expect(props.initialCallDateTime.month).toEqual(1);
        expect(props.initialCallDateTime.day).toEqual(1);
      });
    });
  });
});
