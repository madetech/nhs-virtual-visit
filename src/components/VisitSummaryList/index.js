import React from "react";
import SummaryList from "../SummaryList";
import formatDate from "../../../src/helpers/formatDate";
import formatTime from "../../../src/helpers/formatTime";

const VisitSummaryList = ({
  patientName,
  visitorName,
  visitorMobileNumber,
  visitorEmailAddress,
  visitDateAndTime,
  withActions = false,
  actionLinkOnClick = null,
}) => {
  const visit = [
    {
      key: "Patient name",
      value: patientName,
      actionLinkOnClick: actionLinkOnClick,
      hiddenActionText: "patient name",
    },
    {
      key: "Key contact name",
      value: visitorName,
      actionLinkOnClick: actionLinkOnClick,
      hiddenActionText: "key contact name",
    },
    {
      key: "Key contact mobile number",
      value: visitorMobileNumber || "N/A",
      actionLinkOnClick: actionLinkOnClick,
      hiddenActionText: "key contact mobile number",
    },
    {
      key: "Key contact email address",
      value: visitorEmailAddress || "N/A",
      actionLinkOnClick: actionLinkOnClick,
      hiddenActionText: "key contact email address",
    },
    {
      key: "Date of visit",
      value: formatDate(visitDateAndTime),
      actionLinkOnClick: actionLinkOnClick,
      hiddenActionText: "date of visit",
    },
    {
      key: "Time of visit",
      value: formatTime(visitDateAndTime, "HH:mm"),
      actionLinkOnClick: actionLinkOnClick,
      hiddenActionText: "time of visit",
    },
  ];

  return <SummaryList list={visit} withActions={withActions} />;
};

export default VisitSummaryList;
