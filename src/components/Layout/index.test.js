import React from "react";
import { render, screen } from "@testing-library/react";
import Layout from "./index";
import { WARD_STAFF, TRUST_ADMIN, ADMIN } from "../../helpers/userTypes";

describe("VisitorContactDetailsInput", () => {
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

  describe("when showNavigationBarForType is 'trustAdmin'", () => {
    it("does not display the logout button", () => {
      render(
        <Layout
          showNavigationBarForType={TRUST_ADMIN}
          showNavigationBar={true}
        />
      );

      expect(screen.queryByTestId("logout-button")).toBeNull();
    });

    it("displays the menu button for the navbar", () => {
      render(
        <Layout
          showNavigationBarForType={TRUST_ADMIN}
          showNavigationBar={true}
        />
      );

      expect(screen.getByTestId("navbar-menu-button")).toBeVisible();
    });

    it("displays the wards navigation bar", () => {
      render(
        <Layout
          showNavigationBarForType={TRUST_ADMIN}
          showNavigationBar={true}
        />
      );

      expect(screen.getByTestId("trust-admins-navbar")).toBeVisible();
    });
  });

  describe("when showNavigationBarForType is 'admin'", () => {
    it("does not display the logout button", () => {
      render(
        <Layout showNavigationBarForType={ADMIN} showNavigationBar={true} />
      );

      expect(screen.queryByTestId("logout-button")).toBeNull();
    });

    it("displays the menu button for the navbar", () => {
      render(
        <Layout showNavigationBarForType={ADMIN} showNavigationBar={true} />
      );

      expect(screen.getByTestId("navbar-menu-button")).toBeVisible();
    });

    it("displays the wards navigation bar", () => {
      render(
        <Layout showNavigationBarForType={ADMIN} showNavigationBar={true} />
      );

      expect(screen.getByTestId("admins-navbar")).toBeVisible();
    });
  });
});
