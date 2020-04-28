import React, { useCallback } from "react";
import Button from "../../../src/components/Button";
import { GridRow, GridColumn } from "../../../src/components/Grid";
import Text from "../../../src/components/Text";
import Heading from "../../../src/components/Heading";
import Layout from "../../../src/components/Layout";
import Router from "next/router";
import verifyToken from "../../../src/usecases/verifyToken";
import TokenProvider from "../../../src/providers/TokenProvider";
import retrieveVisitByCallId from "../../../src/usecases/retrieveVisitByCallId";
import propsWithContainer from "../../../src/middleware/propsWithContainer";
import { useState } from "react";
import Error from "next/error";

import formatDate from "../../../src/helpers/formatDate";
import formatTime from "../../../src/helpers/formatTime";

const deleteVisitConfirmation = ({
  wardId,
  callId,
  patientName,
  contactName,
  contactNumber,
  callTime,
  callDate,
  error,
}) => {
  const [hasError, setHasError] = useState(error);

  const onSubmit = useCallback(async (event) => {
    event.preventDefault();
    Router.push(`/wards/${wardId}/cancel-visit-success?callId=${callId}`);
  });

  if (hasError) {
    return <Error />;
  }

  return (
    <Layout title="Confirm cancellation of virtual visit">
      <GridRow>
        <GridColumn width="full">
          <form onSubmit={onSubmit}>
            <Heading>Confirm cancellation of virtual visit</Heading>
            <dl className="nhsuk-summary-list">
              <div className="nhsuk-summary-list__row">
                <dt className="nhsuk-summary-list__key">Patient's name</dt>
                <dd className="nhsuk-summary-list__value">{patientName}</dd>
              </div>

              <div className="nhsuk-summary-list__row">
                <dt className="nhsuk-summary-list__key">Key contact's name</dt>
                <dd className="nhsuk-summary-list__value">{contactName}</dd>
              </div>

              <div className="nhsuk-summary-list__row">
                <dt className="nhsuk-summary-list__key">
                  Key contact's mobile number
                </dt>
                <dd className="nhsuk-summary-list__value">{contactNumber}</dd>
              </div>

              <div className="nhsuk-summary-list__row">
                <dt className="nhsuk-summary-list__key">Date of call</dt>
                <dd className="nhsuk-summary-list__value">{callDate}</dd>
              </div>

              <div className="nhsuk-summary-list__row">
                <dt className="nhsuk-summary-list__key">Time of call</dt>
                <dd className="nhsuk-summary-list__value">{callTime}</dd>
              </div>
            </dl>
            <div className="nhsuk-warning-callout">
              <h3 className="nhsuk-warning-callout__label">
                Inform key contact
              </h3>
              <p>
                It may be appropriate to inform the key contact why this virtual
                visit is being cancelled.
              </p>
            </div>
            <Button>Confirm cancellation</Button>
            <div className="nhsuk-back-link">
              <a
                className="nhsuk-back-link__link"
                href={`/wards/${wardId}/visits`}
              >
                <svg
                  className="nhsuk-icon nhsuk-icon__chevron-left"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.5 12c0-.3.1-.5.3-.7l5-5c.4-.4 1-.4 1.4 0s.4 1 0 1.4L10.9 12l4.3 4.3c.4.4.4 1 0 1.4s-1 .4-1.4 0l-5-5c-.2-.2-.3-.4-.3-.7z"></path>
                </svg>
                Return to virtual visits
              </a>
            </div>
          </form>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyToken(
    async ({ query, container }) => {
      const { id, callId } = query;

      let { scheduledCall, error } = await retrieveVisitByCallId(container)(
        callId
      );
      if (error && !scheduledCall) {
        scheduledCall = {
          patientName: "",
          recipientName: "",
          recipientNumber: "",
          callTime: "",
        };
      }

      const callTime = formatTime(scheduledCall.callTime);
      const callDate = formatDate(scheduledCall.callTime);

      return {
        props: {
          wardId: id,
          patientName: scheduledCall.patientName,
          contactName: scheduledCall.recipientName,
          contactNumber: scheduledCall.recipientNumber,
          callTime,
          callDate,
          callId,
          error,
        },
      };
    },
    {
      tokens: new TokenProvider(process.env.JWT_SIGNING_KEY),
    }
  )
);

export default deleteVisitConfirmation;
