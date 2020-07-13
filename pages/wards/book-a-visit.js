import React, { useState } from "react";
import { GridRow, GridColumn } from "../../src/components/Grid";
import Layout from "../../src/components/Layout";
import ErrorSummary from "../../src/components/ErrorSummary";
import VisitForm from "../../src/components/VisitForm";
import verifyToken from "../../src/usecases/verifyToken";
import Router from "next/router";
import propsWithContainer from "../../src/middleware/propsWithContainer";
import { WARD_STAFF } from "../../src/helpers/userTypes";

const BookAVisit = ({
  initialPatientName,
  initialContactName,
  initialContactNumber,
  initialContactEmail,
  initialCallDateTime,
}) => {
  const [errors, setErrors] = useState([]);

  const submit = (query) => {
    Router.push({
      pathname: `/wards/book-a-visit-confirmation`,
      query,
    });
  };

  return (
    <Layout
      title="Book a virtual visit"
      hasErrors={errors.length != 0}
      showNavigationBarForType={WARD_STAFF}
      showNavigationBar={true}
    >
      <GridRow>
        <GridColumn width="two-thirds">
          <ErrorSummary errors={errors} />
          <VisitForm
            initialPatientName={initialPatientName}
            initialContactName={initialContactName}
            initialContactNumber={initialContactNumber}
            initialContactEmail={initialContactEmail}
            initialCallDateTime={initialCallDateTime}
            errors={errors}
            setErrors={setErrors}
            submit={submit}
          />
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

const queryContainsInitialData = (query) => {
  const initialDataKeys = [
    "patientName",
    "contactName",
    "contactNumber",
    "contactEmail",
    "day",
    "month",
    "year",
    "hour",
    "minute",
  ];

  const queryKeys = Object.keys(query);
  return initialDataKeys.every((key) => queryKeys.includes(key));
};

export const getServerSideProps = propsWithContainer(
  verifyToken(async ({ query, container }) => {
    let props = {};
    if (queryContainsInitialData(query)) {
      const {
        patientName,
        contactName,
        contactNumber,
        contactEmail,
        day,
        month,
        year,
        hour,
        minute,
      } = query;
      const callDateTime = { day, month, year, hour, minute };

      props = {
        ...props,
        initialPatientName: patientName,
        initialContactName: contactName,
        initialContactNumber: contactNumber,
        initialContactEmail: contactEmail,
        initialCallDateTime: callDateTime,
      };
    } else if (query.rebookCallId) {
      const retrieveVisitByCallId = container.getRetrieveVisitByCallId();
      const { scheduledCall } = await retrieveVisitByCallId(query.rebookCallId);

      let proposedCallDateTime = new Date(scheduledCall.callTime);
      proposedCallDateTime.setDate(proposedCallDateTime.getDate() + 1);

      const nextCallDateTime = {
        day: proposedCallDateTime.getDate(),
        month: proposedCallDateTime.getMonth(),
        year: proposedCallDateTime.getFullYear(),
        hour: proposedCallDateTime.getHours(),
        minute: proposedCallDateTime.getMinutes(),
      };

      props = {
        ...props,
        initialPatientName: scheduledCall.patientName,
        initialContactName: scheduledCall.recipientName,
        initialContactNumber: scheduledCall.recipientNumber,
        initialContactEmail: scheduledCall.recipientEmail,
        initialCallDateTime: nextCallDateTime,
      };
    }

    return { props };
  })
);

export default BookAVisit;
