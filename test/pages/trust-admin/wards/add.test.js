import React from "react";
import { getServerSideProps } from "../../../../pages/trust-admin/wards/add";
import AddAWard from "../../../../pages/trust-admin/wards/add";
import { render, screen, fireEvent } from "@testing-library/react";

describe("/trust-admin/wards/add", () => {
  const anonymousReq = {
    headers: {
      cookie: "",
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
        Location: "/trust-admin/login",
      });
    });
  });

  describe("AddAWard", () => {
    it("does not throw a hospital error when default select hospital option", () => {
      render(
        <AddAWard
          hospitals={[
            { id: "1", name: "Adora Hospital" },
            { id: "2", name: "Catra Hospital" },
          ]}
          hospitalId={1}
        />
      );

      fireEvent.click(screen.getByText("Add ward"));

      expect(screen.queryAllByText(/Select a hospital/)).toEqual([]);
    });
  });
});
