import React from "react";
import SummaryList from "../SummaryList";
import AnchorLink from "../AnchorLink";

const HospitalSummaryList = ({
  name,
  surveyUrl,
  supportUrl,
  withActions = false,
  actionLinkOnClick = null,
}) => {
  const visit = [
    {
      key: "Hospital name",
      value: name,
      actionLinkOnClick: actionLinkOnClick,
      hiddenActionText: "hospital name",
    },
    {
      key: "Key contact survey URL",
      value:
        (surveyUrl && (
          <AnchorLink href={surveyUrl}>
            Link
            <span className="nhsuk-u-visually-hidden"> for {name} survey</span>
          </AnchorLink>
        )) ||
        "None",
      actionLinkOnClick: actionLinkOnClick,
      hiddenActionText: "key contact survey URL",
    },
    {
      key: "Support URL",
      value:
        (supportUrl && (
          <AnchorLink href={supportUrl}>
            Link
            <span className="nhsuk-u-visually-hidden"> for {name} support</span>
          </AnchorLink>
        )) ||
        "None",
      actionLinkOnClick: actionLinkOnClick,
      hiddenActionText: "support URL",
    },
  ];

  return <SummaryList list={visit} withActions={withActions} />;
};

export default HospitalSummaryList;
