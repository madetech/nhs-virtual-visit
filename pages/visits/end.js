import React from "react";
import Layout from "../../src/components/Layout";
import ActionLinkSection from "../../src/components/ActionLinkSection";
import ActionLink from "../../src/components/ActionLink";
import AnchorLink from "../../src/components/AnchorLink";
import InsetText from "../../src/components/InsetText";
import propsWithContainer from "../../src/middleware/propsWithContainer";

const End = ({ wardId, callId, surveyUrl, supportUrl }) => {
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
                <p className="nhsuk-u-margin-bottom-0">
                  Thank you for using the virtual visit service.
                </p>
              </div>
            </div>

            <InsetText>
              Your personal data will be removed within 24 hours.
            </InsetText>

            <ActionLinkSection
              heading="What happens next"
              link={supportUrl}
              linkText="Get support from this hospital"
            />

            <ActionLinkSection
              heading="Help improve virtual visits"
              link={surveyUrl}
              linkText="Take a survey"
            >
              <p>
                We’d welcome your feedback. Can you answer some questions about
                your virtual visit today?
              </p>
            </ActionLinkSection>
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

    const {
      supportUrl,
      error: supportUrlError,
    } = await container.getRetrieveSupportUrlByCallId()(query.callId);

    const error = surveyUrlError || supportUrlError;

    if (error) console.error(error);

    return {
      props: {
        wardId: token?.ward || null,
        callId: query.callId,
        surveyUrl,
        supportUrl,
      },
    };
  }
);

export default End;
