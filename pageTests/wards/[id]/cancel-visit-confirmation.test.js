import { getServerSideProps } from "../../../pages/wards/[id]/cancel-visit-confirmation";

describe("/wards/[id]/cancel-visit-confirmation", () => {
  it("redirects to the /wards/cancel-visit-confirmation page", () => {
    const res = {
      writeHead: jest.fn(),
      end: jest.fn(),
    };

    getServerSideProps({ res });

    expect(res.writeHead).toHaveBeenCalledWith(301, {
      Location: "/wards/cancel-visit-confirmation",
    });
  });
});
