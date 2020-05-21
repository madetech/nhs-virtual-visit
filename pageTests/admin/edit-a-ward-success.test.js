import { getServerSideProps } from "../../pages/admin/edit-a-ward-success";

const authenticatedReq = {
  headers: {
    cookie: "token=123",
  },
};

describe("/admin/edit-a-ward-success", () => {
  const anonymousReq = {
    headers: {
      cookie: "",
    },
  };

  let res;

  const tokenProvider = {
    validate: jest.fn(() => ({ type: "trustAdmin", trustId: 1 })),
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

    describe("with wardId parameter", () => {
      it("retrieves a ward by the wardId parameter", async () => {
        const retrieveWardByIdSpy = jest.fn().mockReturnValue({
          ward: {
            id: 1,
            name: "Defoe Ward",
            hospitalName: "Northwick Park Hospital",
          },
          error: null,
        });

        const container = {
          getRetrieveWardById: () => retrieveWardByIdSpy,
          getTokenProvider: () => tokenProvider,
        };

        await getServerSideProps({
          req: authenticatedReq,
          res,
          query: {
            wardId: "ward ID",
          },
          container,
        });

        expect(retrieveWardByIdSpy).toHaveBeenCalledWith("ward ID", 1);
      });

      it("set a ward prop based on the retrieved ward", async () => {
        const retrieveWardByIdSpy = jest.fn().mockReturnValue({
          ward: {
            id: 1,
            name: "Defoe Ward",
            hospitalName: "Northwick Park Hospital",
          },
          error: null,
        });

        const container = {
          getRetrieveWardById: () => retrieveWardByIdSpy,
          getTokenProvider: () => tokenProvider,
        };

        const { props } = await getServerSideProps({
          req: authenticatedReq,
          res,
          query: {
            wardId: "1",
          },
          container,
        });

        expect(props.name).toEqual("Defoe Ward");
        expect(props.hospitalName).toEqual("Northwick Park Hospital");
      });
    });
  });
});
