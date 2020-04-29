import { getServerSideProps } from "../../../pages/wards/[id]/schedule-confirmation";

describe("/wards/[id]/schedule-confirmation", () => {
  it("redirects to the /wards/schedule-confirmation page", () => {
    const query = {
      foo: "123",
    };
    const res = {
      writeHead: jest.fn(),
      end: jest.fn(),
    };

    getServerSideProps({ res, query });

    expect(res.writeHead).toHaveBeenCalledWith(301, {
      Location: "/wards/schedule-confirmation?foo=123",
    });
  });
});
