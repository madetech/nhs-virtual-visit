import React from "react";
import { render, queryByAttribute } from "@testing-library/react";
import EndOfVisit, { getServerSideProps } from "../../pages/visits/end";
import * as Sentry from "@sentry/node";

jest.mock("@sentry/node");

describe("end", () => {
  describe("for a key contact", () => {
    it("renders end of visit message", () => {
      const { getByText } = render(<EndOfVisit />);
      const text = getByText(/visit has completed/i);

      expect(text).toBeInTheDocument();
    });

    it("renders the survey section if there is a survey link", () => {
      const { getByText } = render(
        <EndOfVisit surveyUrl="https://www.survey.example.com" />
      );
      const text = getByText(/Help improve virtual visits/i);

      expect(text).toBeInTheDocument();
    });

    it("does not render the survey section if there is no survey link", () => {
      const { queryByText } = render(<EndOfVisit surveyUrl={null} />);
      const text = queryByText(/Help improve virtual visits/i);

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
    const surveyUrl = "https://www.survey.example.com";

    const retrieveSurveyUrlByCallId = jest.fn().mockResolvedValue({
      surveyUrl,
      error: null,
    });

    const container = {
      getUserIsAuthenticated: () =>
        jest.fn().mockResolvedValue({ ward: "test-ward-id" }),
      getRetrieveSurveyUrlByCallId: () => retrieveSurveyUrlByCallId,
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

    it("retrieves the survey link of the hospital", async () => {
      const { props } = await getServerSideProps({ req, container, query });

      expect(retrieveSurveyUrlByCallId).toHaveBeenCalledWith(callId);
      expect(props.surveyUrl).toEqual(surveyUrl);
      expect(Sentry.captureException).not.toHaveBeenCalled();
    });

    it("send the survey link error to Sentry", async () => {
      const retrieveSurveyUrlByCallIdError = jest.fn().mockResolvedValue({
        surveyUrl: null,
        error: "Error!",
      });

      await getServerSideProps({
        req,
        container: {
          ...container,
          getRetrieveSurveyUrlByCallId: () => retrieveSurveyUrlByCallIdError,
        },
        query,
      });

      expect(Sentry.captureException).toHaveBeenCalledWith("Error!");
    });
  });
});
