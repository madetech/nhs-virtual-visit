import React from "react";
import Error from "next/error";
import Layout from "../../src/components/Layout";
import ActionLink from "../../src/components/ActionLink";
import AnchorLink from "../../src/components/AnchorLink";
import propsWithContainer from "../../src/middleware/propsWithContainer";

const End = ({ wardId, callId, surveyUrl, error }) => {
  if (error) {
    return <Error error={error} />;
  }

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

              <div className="nhsuk-panel__body">
                <p>Thank you for using the virtual visit service.</p>
                <p>Your personal data will be removed within 24 hours.</p>
              </div>
            </div>
            {surveyUrl && (
              <>
                <h2>Help improve virtual visits</h2>
                <p>
                  We’d welcome your feedback. Can you answer some questions
                  about your virtual visit today?
                </p>

                <ActionLink href={surveyUrl}>Take a survey</ActionLink>
              </>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  async ({ req: { headers }, container, query }) => {
    const userIsAuthenticated = container.getUserIsAuthenticated();

    const token = await userIsAuthenticated(headers.cookie);

    const {
      surveyUrl,
      error: surveyUrlError,
    } = await container.getRetrieveSurveyUrlByCallId()(query.callId);

    return {
      props: {
        wardId: token?.ward || null,
        callId: query.callId,
        surveyUrl,
        error: surveyUrlError,
      },
    };
  }
);

export default End;
