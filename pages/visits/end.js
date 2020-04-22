import React from "react";
import Layout from "../../src/components/Layout";
import ActionLink from "../../src/components/ActionLink";
import userIsAuthenticated from "../../src/usecases/userIsAuthenticated";
import TokenProvider from "../../src/providers/TokenProvider";

export default ({ wardId }) => (
  <Layout>
    <div className="nhsuk-grid-row">
      {wardId && (
        <div className="nhsuk-grid-column-two-thirds">
          <div className="nhsuk-panel nhsuk-panel--confirmation nhsuk-u-margin-top-0 nhsuk-u-margin-bottom-4">
            <h1 className="nhsuk-panel__title">
              Your virtual visit has completed
            </h1>

            <div className="nhsuk-panel__body">
              <p>
                Thank you for using the virtual visit service, please hand the
                iPad back to a NHS staff member
              </p>
            </div>
          </div>
          <h2>What happens next</h2>

          <ActionLink href={`/wards/${wardId}/visits`}>
            Return to scheduled visit list
          </ActionLink>
        </div>
      )}
      {!wardId && (
        <div className="nhsuk-grid-column-two-thirds">
          <div className="nhsuk-panel nhsuk-panel--confirmation nhsuk-u-margin-top-0 nhsuk-u-margin-bottom-4">
            <h1 className="nhsuk-panel__title">
              Your virtual visit has completed
            </h1>

            <div className="nhsuk-panel__body">
              <p>Thanks for using the virtual visit service.</p>
              <p>Your personal data will be removed within 24 hours.</p>
            </div>
          </div>
          <h2>What happens next</h2>
          <p>
            To schedule another virtual visit, please contact the hospital
            again.
          </p>

          <ActionLink href={`https://www.lnwh.nhs.uk/support`}>
            Get further help and support
          </ActionLink>
        </div>
      )}
    </div>
  </Layout>
);

export const getServerSideProps = ({ req: { headers }, res }) => {
  const token = userIsAuthenticated({
    getTokenProvider: () => new TokenProvider(process.env.JWT_SIGNING_KEY),
  })(headers.cookie);
  console.log(token);

  return { props: { wardId: token?.ward || null } };
};
