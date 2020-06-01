import React from "react";
import { render, screen } from "@testing-library/react";
import Layout from "./index";

describe("VisitorContactDetailsInput", () => {
  describe("when renderLogout is true", () => {
    it("displays the logout button", () => {
      render(<Layout renderLogout={true} />);

      expect(screen.getByTestId("logout-button")).toBeVisible();
    });
  });

  describe("when renderLogout is false", () => {
    it("does not display the logout button", () => {
      render(<Layout renderLogout={false} />);

      expect(screen.queryByTestId("logout-button")).toBeNull();
    });
  });

  describe("when showNavigationBarForType is 'wardStaff'", () => {
    it("does not display the logout button", () => {
      render(<Layout showNavigationBarForType="wardStaff" />);

      expect(screen.queryByTestId("logout-button")).toBeNull();
    });

    it("displays the menu button for the navbar", () => {
      render(<Layout showNavigationBarForType="wardStaff" />);

      expect(screen.getByTestId("navbar-menu-button")).toBeVisible();
    });

    it("displays the wards navigation bar", () => {
      render(<Layout showNavigationBarForType="wardStaff" />);

      expect(screen.getByTestId("wards-navbar")).toBeVisible();
    });
  });
});
