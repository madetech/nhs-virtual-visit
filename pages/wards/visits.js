import React from "react";
import Layout from "../../src/components/Layout";
import HeadingWithTime from "../../src/components/HeadingWithTime";
import { GridRow, GridColumn } from "../../src/components/Grid";
import Error from "next/error";
import Text from "../../src/components/Text";
import verifyToken from "../../src/usecases/verifyToken";
import propsWithContainer from "../../src/middleware/propsWithContainer";
import AccordionVisits from "../../src/components/AccordionVisits";

export default function WardVisits({ scheduledCalls, ward, error }) {
  if (error) {
    return <Error />;
  }
  return (
    <Layout title="Virtual visits" showNavigationBarForType="wardStaff">
      <GridRow>
        <GridColumn width="full">
          <HeadingWithTime>
            <span className="nhsuk-caption-l">
              Ward: {ward.name}
              <span className="nhsuk-u-visually-hidden">-</span>
            </span>
            Virtual visits
          </HeadingWithTime>

          {scheduledCalls.length > 0 ? (
            <AccordionVisits visits={scheduledCalls} />
          ) : (
            <Text>There are no upcoming virtual visits.</Text>
          )}
        </GridColumn>
      </GridRow>
    </Layout>
  );
}

export const getServerSideProps = propsWithContainer(
  verifyToken(async ({ authenticationToken, container }) => {
    const { wardId, trustId } = authenticationToken;

    let { scheduledCalls, error } = await container.getRetrieveVisits()({
      wardId,
    });
    let ward;
    ({ ward, error } = await container.getRetrieveWardById()(wardId, trustId));

    return {
      props: { scheduledCalls, ward, error },
    };
  })
);
