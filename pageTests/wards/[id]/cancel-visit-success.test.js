import { getServerSideProps } from "../../../pages/wards/[id]/cancel-visit-success";

describe("/wards/[id]/cancel-visit-success", () => {
  it("redirects to the /wards/cancel-visit-success page", () => {
    const query = {
      foo: "123",
    };
    const res = {
      writeHead: jest.fn(),
      end: jest.fn(),
    };

    getServerSideProps({ res, query });

    expect(res.writeHead).toHaveBeenCalledWith(301, {
      Location: "/wards/cancel-visit-success?foo=123",
    });
  });
});
