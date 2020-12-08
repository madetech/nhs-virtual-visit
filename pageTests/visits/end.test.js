import React from "react";
import { render, queryByAttribute } from "@testing-library/react";
import EndOfVisit, { getServerSideProps } from "../../pages/visits/end";

describe("end", () => {
  describe("for a key contact", () => {
    it("renders end of visit message", () => {
      const { getByText } = render(<EndOfVisit />);
      const text = getByText(/visit has completed/i);

      expect(text).toBeInTheDocument();
    });

    it("renders the support section if there is a support link", () => {
      const { getByText } = render(
        <EndOfVisit supportUrl="https://www.support.example.com" />
      );
      const text = getByText(/Get support from this hospital/i);

      expect(text).toBeInTheDocument();
    });

    it("does not render the support section if there is no support link", () => {
      const { queryByText } = render(<EndOfVisit supportUrl={null} />);
      const text = queryByText(/Get support from this hospital/i);

      expect(text).toBeNull();
    });
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

    const callId = "TEST123";
    const query = { callId };
    const supportUrl = "https://www.support.example.com";
    const urQuestionUrl = "https://www.support.example.com";

    const retrieveSupportUrlByCallId = jest.fn().mockResolvedValue({
      supportUrl,
      error: null,
    });

    const retrieveUrQuestionUrl = jest.fn().mockResolvedValue({
      urQuestionUrl,
      error: null,
    });

    const container = {
      getUserIsAuthenticated: () =>
        jest.fn().mockResolvedValue({ ward: "test-ward-id" }),
      getRetrieveSupportUrlByCallId: () => retrieveSupportUrlByCallId,
      getRetrieveUrQuestionUrl: () => retrieveUrQuestionUrl,
    };

    it("provides the call id", async () => {
      const { props } = await getServerSideProps({ req, container, query });

      expect(props.callId).toEqual("TEST123");
    });

    it("provides the ward id if the user is authenticated", async () => {
      const { props } = await getServerSideProps({ req, container, query });

      expect(props.wardId).toEqual("test-ward-id");
    });

    it("does not provides the ward id if the user is unauthenticated", async () => {
      const { props } = await getServerSideProps({
        req,
        container: {
          ...container,
          getUserIsAuthenticated: () => jest.fn().mockResolvedValue(false),
        },
        query,
      });

      expect(props.wardId).toBeNull();
    });

    it("retrieves the support link of the hospital", async () => {
      const { props } = await getServerSideProps({ req, container, query });

      expect(props.supportUrl).toEqual(supportUrl);
    });
  });
});
