import { getServerSideProps } from "../../../pages/wards/[id]/schedule-success";

describe("/wards/[id]/schedule-success", () => {
  it("redirects to the /wards/book-a-visit-success page", () => {
    const query = {
      foo: "123",
    };
    const res = {
      writeHead: jest.fn(),
      end: jest.fn(),
    };

    getServerSideProps({ res, query });

    expect(res.writeHead).toHaveBeenCalledWith(301, {
      Location: "/wards/book-a-visit-success?foo=123",
    });
  });
});
