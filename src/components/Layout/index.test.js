import React from "react";
import { render, screen } from "@testing-library/react";
import Layout from "./index";
import { WARD_STAFF } from "../../helpers/userTypes";

describe("VisitorContactDetailsInput", () => {
  describe("when renderLogout is true and the navigation bar is not showing", () => {
    it("displays the logout button", () => {
      render(<Layout renderLogout={true} showNavigationBar={false} />);

      expect(screen.getByTestId("logout-button")).toBeVisible();
    });
  });

  describe("when renderLogout is false and the navigation bar is not showing", () => {
    it("does not display the logout button", () => {
      render(<Layout renderLogout={false} showNavigationBar={false} />);

      expect(screen.queryByTestId("logout-button")).toBeNull();
    });
  });

  describe("when showNavigationBarForType is 'wardStaff'", () => {
    it("does not display the logout button", () => {
      render(
        <Layout
          showNavigationBarForType={WARD_STAFF}
          showNavigationBar={true}
        />
      );

      expect(screen.queryByTestId("logout-button")).toBeNull();
    });

    it("displays the menu button for the navbar", () => {
      render(
        <Layout
          showNavigationBarForType={WARD_STAFF}
          showNavigationBar={true}
        />
      );

      expect(screen.getByTestId("navbar-menu-button")).toBeVisible();
    });

    it("displays the wards navigation bar", () => {
      render(
        <Layout
          showNavigationBarForType={WARD_STAFF}
          showNavigationBar={true}
        />
      );

      expect(screen.getByTestId("wards-navbar")).toBeVisible();
    });
  });
});
