import { getServerSideProps } from "../../../pages/wards/[id]/schedule-visit";

describe("/wards/[id]/schedule-visit", () => {
  it("redirects to the /wards/schedule-visit page", () => {
    const query = {
      foo: "123",
    };
    const res = {
      writeHead: jest.fn(),
      end: jest.fn(),
    };

    getServerSideProps({ res, query });

    expect(res.writeHead).toHaveBeenCalledWith(301, {
      Location: "/wards/schedule-visit?foo=123",
    });
  });
});
