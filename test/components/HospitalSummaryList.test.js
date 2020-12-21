import React from "react";
import { render, screen } from "@testing-library/react";
import HospitalSummaryList from "../../src/components/HospitalSummaryList/index";

describe("HospitalSummaryList", () => {
  const name = "Test Hospital";
  const surveyUrl = "https://www.survey.example.com";
  const supportUrl = "https://www.support.example.com";

  it("renders the details of a hospital", () => {
    render(
      <HospitalSummaryList
        name={name}
        surveyUrl={surveyUrl}
        supportUrl={supportUrl}
      />
    );

    expect(screen.getByText(name)).toBeVisible();
    expect(screen.queryAllByText("Link")[0]).toHaveAttribute("href", surveyUrl);
    expect(screen.queryAllByText("Link")[1]).toHaveAttribute(
      "href",
      supportUrl
    );
  });

  it("renders 'None' if no survey URL", () => {
    render(<HospitalSummaryList name={name} supportUrl={supportUrl} />);

    expect(screen.getByText("None")).toBeVisible();
  });

  it("renders 'None' if no support URL", () => {
    render(<HospitalSummaryList name={name} surveyUrl={surveyUrl} />);

    expect(screen.getByText("None")).toBeVisible();
  });

  it("does not render Change links by default", () => {
    render(
      <HospitalSummaryList
        name={name}
        surveyUrl={surveyUrl}
        supportUrl={supportUrl}
      />
    );

    expect(screen.queryAllByText("Change")).toEqual([]);
  });

  it("render Change links if withActions is true", () => {
    render(
      <HospitalSummaryList
        name={name}
        surveyUrl={surveyUrl}
        supportUrl={supportUrl}
        withActions={true}
      />
    );

    expect(screen.queryAllByText("Change")).not.toEqual([]);
  });
});
