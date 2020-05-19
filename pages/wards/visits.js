import React from "react";
import Layout from "../../src/components/Layout";
import Heading from "../../src/components/Heading";
import ActionLink from "../../src/components/ActionLink";
import { GridRow, GridColumn } from "../../src/components/Grid";
import VisitsPanelList from "../../src/components/VisitsPanelList";
import Error from "next/error";
import Text from "../../src/components/Text";
import verifyToken from "../../src/usecases/verifyToken";
import TokenProvider from "../../src/providers/TokenProvider";
import propsWithContainer from "../../src/middleware/propsWithContainer";

export default function WardVisits({ scheduledCalls, ward, error }) {
  if (error) {
    return <Error />;
  }

  return (
    <Layout title="Virtual visits" renderLogout={true}>
      <GridRow>
        <GridColumn width="full">
          <Heading>
            <span className="nhsuk-caption-l">
              Ward: {ward.name}
              <span className="nhsuk-u-visually-hidden">-</span>
            </span>
            Virtual visits
          </Heading>

          <h2 className="nhsuk-heading-l">Book a virtual visit</h2>

          <Text>
            You&apos;ll need the name and mobile number of your patient&apos;s
            key contact in order to set up a virtual visit.
          </Text>

          <ActionLink href={`/wards/book-a-visit`}>
            Book a virtual visit
          </ActionLink>

          <h2 className="nhsuk-heading-l">Pre-booked virtual visits</h2>

          {scheduledCalls.length > 0 ? (
            <VisitsPanelList visits={scheduledCalls} />
          ) : (
            <Text>There are no upcoming virtual visits.</Text>
          )}
        </GridColumn>
      </GridRow>
    </Layout>
  );
}

export const getServerSideProps = propsWithContainer(
  verifyToken(
    async ({ authenticationToken, container, query }) => {
      const { wardId, trustId } = authenticationToken;
      let { scheduledCalls, error } = await container.getRetrieveVisits()({
        wardId,
      });
      let ward;
      ({ ward, error } = await container.getRetrieveWardById()(
        wardId,
        trustId
      ));
      const showAccordion = Boolean(query.showAccordion);

      return {
        props: { scheduledCalls, ward, error, showAccordion: showAccordion },
      };
    },
    {
      tokens: new TokenProvider(process.env.JWT_SIGNING_KEY),
    }
  )
);
