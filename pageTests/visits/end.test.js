import React from "react";
import { render } from "@testing-library/react";
import EndOfVisit, { getServerSideProps } from "../../pages/visits/end";
import TokenProvider from "../../src/providers/TokenProvider";

describe("end", () => {
  it("renders end of visit message", () => {
    const { getByText } = render(<EndOfVisit />);
    const text = getByText(/visit has completed/i);
    expect(text).toBeInTheDocument();
  });

  describe("for a key contact", () => {
    it("has a link to the help and support page", () => {
      const { queryByText } = render(<EndOfVisit />);
      const text = queryByText(/Get further help and support/i);
      expect(text).toBeInTheDocument();
    });
    it("does not show a link to the ward page", () => {
      const { queryByText } = render(<EndOfVisit />);
      const text = queryByText(/return to scheduled visit list/i);
      expect(text).not.toBeInTheDocument();
    });
  });

  describe("for a staff member", () => {
    it("has a link back to the ward visits page", () => {
      const { getByText } = render(<EndOfVisit wardId="TEST" />);
      const text = getByText(/return to scheduled visit list/i);
      expect(text).toBeInTheDocument();
    });
    it("does not show a link to the help and support page", () => {
      const { queryByText } = render(<EndOfVisit wardId="TEST" />);
      const text = queryByText(/Get further help and support/i);
      expect(text).not.toBeInTheDocument();
    });
  });

  describe("getServerSideProps", () => {
    it("provides the ward id if the user is authenticated", () => {
      process.env.JWT_SIGNING_KEY = "test-key";
      const tokenProvider = new TokenProvider(process.env.JWT_SIGNING_KEY);
      const token = tokenProvider.generate("test-ward-id");

      const req = {
        headers: {
          cookie: `token=${token}`,
        },
      };

      const { props } = getServerSideProps({ req });

      expect(props.wardId).toEqual("test-ward-id");
    });

    it("does not provides the ward id if the user is unauthenticated", () => {
      const req = {
        headers: {
          cookie: "",
        },
      };

      const { props } = getServerSideProps({ req });

      expect(props.wardId).toBeNull();
    });
  });
});
