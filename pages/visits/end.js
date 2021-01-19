import React, { useEffect } from "react";
import Layout from "../../src/components/Layout";
import ActionLink from "../../src/components/ActionLink";
import AnchorLink from "../../src/components/AnchorLink";
import InsetText from "../../src/components/InsetText";
import propsWithContainer from "../../src/middleware/propsWithContainer";
import { v4 as uuidv4 } from "uuid";

const EndOfVisit = ({ wardId, callId, correlationId }) => {
  useEffect(() => {
    console.log(correlationId);
  }, []);
  return (
    <Layout title="Your virtual visit has completed" isBookService={false}>
      <div className="nhsuk-grid-row">
        {wardId && (
          <div className="nhsuk-grid-column-two-thirds">
            <div
              className="nhsuk-panel nhsuk-panel--confirmation nhsuk-u-margin-top-0 nhsuk-u-margin-bottom-4"
              style={{ textAlign: "center" }}
            >
              <h1 className="nhsuk-panel__title">
                Your virtual visit has completed
              </h1>

              <div className="nhsuk-panel__body">
                <p>
                  Thank you for using the virtual visit service. Please hand the
                  iPad back to a NHS staff member.
                </p>
              </div>
            </div>
            <h2>What happens next</h2>

            <ActionLink href={`/wards/book-a-visit?rebookCallId=${callId}`}>
              Rebook another virtual visit
            </ActionLink>

            <p>
              <AnchorLink href="/wards/visits">
                Return to virtual visits
              </AnchorLink>
            </p>
          </div>
        )}
        {!wardId && (
          <div className="nhsuk-grid-column-two-thirds">
            <div
              className="nhsuk-panel nhsuk-panel--confirmation nhsuk-u-margin-top-0 nhsuk-u-margin-bottom-4"
              style={{ textAlign: "center" }}
            >
              <h1 className="nhsuk-panel__title">
                Your virtual visit has completed
              </h1>

              <p className="nhsuk-u-margin-bottom-0">
                Thank you for using the virtual visit service.
              </p>
            </div>

            <InsetText>
              Your personal data will be removed within 24 hours.
            </InsetText>
          </div>
        )}
      </div>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  async ({ req: { headers }, container, query }) => {
    const userIsAuthenticated = container.getUserIsAuthenticated();
    //We'll need to have the submit button be able to send a request to the events logging thing
    //We'll then need to have it move on to another page
    //What if we stuck another part into the workflow between the end and this page?

    const token = await userIsAuthenticated(headers.cookie);
    const correlationId = `${uuidv4()}-visit-ended`;

    return {
      props: {
        wardId: token?.ward || null,
        callId: query.callId,
        correlationId,
      },
    };
  }
);

export default EndOfVisit;
