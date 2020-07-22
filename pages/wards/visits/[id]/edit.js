import React, { useState } from "react";
import { GridRow, GridColumn } from "../../../../src/components/Grid";
import Layout from "../../../../src/components/Layout";
import ErrorSummary from "../../../../src/components/ErrorSummary";
import VisitForm from "../../../../src/components/VisitForm";
import verifyToken from "../../../../src/usecases/verifyToken";
import Router from "next/router";
import propsWithContainer from "../../../../src/middleware/propsWithContainer";
import { WARD_STAFF } from "../../../../src/helpers/userTypes";

const EditAVisit = ({
  id,
  initialPatientName,
  initialContactName,
  initialContactNumber,
  initialContactEmail,
  initialCallDateTime,
}) => {
  const [errors, setErrors] = useState([]);

  const submit = (query) => {
    Router.push({
      pathname: `/wards/visits/${id}/edit-confirmation`,
      query,
    });
  };

  return (
    <Layout
      title="Edit a virtual visit"
      hasErrors={errors.length != 0}
      showNavigationBarForType={WARD_STAFF}
      showNavigationBar={true}
    >
      <GridRow>
        <GridColumn width="two-thirds">
          <ErrorSummary errors={errors} />
          <VisitForm
            heading="Edit a virtual visit"
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
  verifyToken(async ({ authenticationToken, query, container }) => {
    const id = query.id;

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

      return {
        props: {
          id,
          initialPatientName: patientName,
          initialContactName: contactName,
          initialContactNumber: contactNumber,
          initialContactEmail: contactEmail,
          initialCallDateTime: callDateTime,
        },
      };
    } else {
      const { wardId } = authenticationToken;

      const retrieveVisitById = container.getRetrieveVisitById();

      const { scheduledCall } = await retrieveVisitById({ id, wardId });

      const callTime = new Date(scheduledCall.callTime);

      const initialCallDateTime = {
        day: callTime.getDate(),
        month: callTime.getMonth(),
        year: callTime.getFullYear(),
        hour: callTime.getHours(),
        minute: callTime.getMinutes(),
      };

      return {
        props: {
          id,
          initialPatientName: scheduledCall.patientName,
          initialContactName: scheduledCall.recipientName,
          initialContactNumber: scheduledCall.recipientNumber,
          initialContactEmail: scheduledCall.recipientEmail,
          initialCallDateTime,
        },
      };
    }
  })
);

export default EditAVisit;
