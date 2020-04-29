import { getServerSideProps } from "../../../pages/wards/[id]/visits";

describe("/wards/[id]/visits", () => {
  it("redirects to the /wards/visits page", () => {
    const query = {
      foo: "123",
    };
    const res = {
      writeHead: jest.fn(),
      end: jest.fn(),
    };

    getServerSideProps({ res, query });

    expect(res.writeHead).toHaveBeenCalledWith(301, {
      Location: "/wards/visits?foo=123",
    });
  });
});
