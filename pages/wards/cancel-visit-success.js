import React from "react";
import Layout from "../../src/components/Layout";
import ActionLink from "../../src/components/ActionLink";
import AnchorLink from "../../src/components/AnchorLink";
import verifyToken from "../../src/usecases/verifyToken";
import retrieveVisitByCallId from "../../src/usecases/retrieveVisitByCallId";
import deleteVisitByCallId from "../../src/usecases/deleteVisitByCallId";
import propsWithContainer from "../../src/middleware/propsWithContainer";
import Error from "next/error";
import formatDateAndTime from "../../src/helpers/formatDateAndTime";
import { WARD_STAFF } from "../../src/helpers/userTypes";

const deleteVisitSuccess = ({
  patientName,
  callDateAndTime,
  error,
  deleteError,
  showNavigationBar,
}) => {
  if (error || deleteError) {
    return <Error />;
  }

  return (
    <Layout
      title="Virtual visit cancelled"
      showNavigationBarForType={WARD_STAFF}
      renderLogout={true}
      showNavigationBar={showNavigationBar}
    >
      <div className="nhsuk-grid-row">
        <div className="nhsuk-grid-column-two-thirds">
          <div
            className="nhsuk-panel nhsuk-panel--confirmation nhsuk-u-margin-top-0 nhsuk-u-margin-bottom-4"
            style={{ textAlign: "center" }}
          >
            <h1 className="nhsuk-panel__title nhsuk-u-margin-bottom-4">
              Virtual visit cancelled
            </h1>

            <div className="nhsuk-panel__body">
              for {patientName} on
              <br />
              <strong>{formatDateAndTime(callDateAndTime, "HH:mm")}</strong>
            </div>
          </div>
          <h2>What happens next</h2>

          <ActionLink href={`/admin/add-a-ward`}>
            Book a virtual visit
          </ActionLink>

          <p>
            <AnchorLink href="/wards/visits">
              Return to virtual visits
            </AnchorLink>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyToken(async ({ query, container }) => {
    const { callId } = query;
    let { scheduledCall, error } = await retrieveVisitByCallId(container)(
      callId
    );
    if (error && !scheduledCall) {
      scheduledCall = {
        patientName: "",
        callTime: "",
      };
    }

    let { error: deleteError } = await deleteVisitByCallId(container)(callId);

    const showNavigationBar = process.env.SHOW_NAVIGATION_BAR === "yes";

    return {
      props: {
        patientName: scheduledCall.patientName,
        callDateAndTime: scheduledCall.callTime,
        error,
        deleteError,
        showNavigationBar,
      },
    };
  })
);

export default deleteVisitSuccess;
