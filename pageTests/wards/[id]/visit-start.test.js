import { getServerSideProps } from "../../../pages/wards/[id]/visit-start";

describe("/wards/[id]/visit-start", () => {
  it("redirects to the /wards/visit-start page", () => {
    const query = {
      foo: "123",
    };
    const res = {
      writeHead: jest.fn(),
      end: jest.fn(),
    };

    getServerSideProps({ res, query });

    expect(res.writeHead).toHaveBeenCalledWith(301, {
      Location: "/wards/visit-start?foo=123",
    });
  });
});
