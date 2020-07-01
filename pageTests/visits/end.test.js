import React from "react";
import { render, queryByAttribute } from "@testing-library/react";
import EndOfVisit, { getServerSideProps } from "../../pages/visits/end";

describe("end", () => {
  it("renders end of visit message", () => {
    const { getByText } = render(<EndOfVisit />);
    const text = getByText(/visit has completed/i);

    expect(text).toBeInTheDocument();
  });

  describe("for a staff member", () => {
    it("has a link back to the ward visits page", () => {
      const { getByText } = render(<EndOfVisit wardId="TEST" />);
      const text = getByText(/return to virtual visits/i);

      expect(text).toBeInTheDocument();
    });

    it("does not show a link to the help and support page", () => {
      const { queryByText } = render(<EndOfVisit wardId="TEST" />);
      const text = queryByText(/Get further help and support/i);

      expect(text).not.toBeInTheDocument();
    });

    it("shows the correct rebook link", () => {
      const { getByText } = render(
        <EndOfVisit wardId="TEST" callId="TEST123" />
      );
      const text = getByText(/Rebook another virtual visit/i);

      expect(text).toBeInTheDocument();
    });

    it("contains the correct rebook link url", () => {
      const { container } = render(
        <EndOfVisit wardId="TEST" callId="TEST123" />
      );
      const getByHref = queryByAttribute.bind(null, "href");
      const rebookLink = getByHref(
        container,
        "/wards/book-a-visit?rebookCallId=TEST123"
      );

      expect(rebookLink).toBeInTheDocument();
    });
  });

  describe("getServerSideProps", () => {
    const req = {
      headers: {
        cookie: "",
      },
    };

    it("provides the call id", async () => {
      const container = {
        getUserIsAuthenticated: () =>
          jest.fn().mockResolvedValue({ ward: "test-ward-id" }),
      };
      const query = { callId: "TEST123" };
      const { props } = await getServerSideProps({ req, container, query });

      expect(props.callId).toEqual("TEST123");
    });

    it("provides the ward id if the user is authenticated", async () => {
      const container = {
        getUserIsAuthenticated: () =>
          jest.fn().mockResolvedValue({ ward: "test-ward-id" }),
      };

      const query = { callId: "TEST123" };
      const { props } = await getServerSideProps({ req, container, query });

      expect(props.wardId).toEqual("test-ward-id");
    });

    it("does not provides the ward id if the user is unauthenticated", async () => {
      const container = {
        getUserIsAuthenticated: () => jest.fn().mockResolvedValue(false),
      };
      const query = { callId: "TEST123" };
      const { props } = await getServerSideProps({ req, container, query });

      expect(props.wardId).toBeNull();
    });
  });
});
