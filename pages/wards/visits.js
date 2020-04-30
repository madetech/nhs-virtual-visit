import retrieveVisits from "../../src/usecases/retrieveVisits";
import Layout from "../../src/components/Layout";
import Heading from "../../src/components/Heading";
import ActionLink from "../../src/components/ActionLink";
import { GridRow, GridColumn } from "../../src/components/Grid";
import VisitsTable from "../../src/components/VisitsTable";
import Error from "next/error";
import Text from "../../src/components/Text";
import verifyToken from "../../src/usecases/verifyToken";
import TokenProvider from "../../src/providers/TokenProvider";
import propsWithContainer from "../../src/middleware/propsWithContainer";

export default function WardVisits({ scheduledCalls, error, wardId }) {
  if (error) {
    return <Error />;
  }

  return (
    <Layout title="Virtual visits">
      <GridRow>
        <GridColumn width="full">
          <Heading>
            <span className="nhsuk-caption-l">
              Ward: {wardId}
              <span className="nhsuk-u-visually-hidden">-</span>
            </span>
            Virtual visits
          </Heading>

          <h2 className="nhsuk-heading-l">Book a virtual visit</h2>

          <Text>
            You'll need the mobile number of your patient's key contact in order
            to set up a virtual visit.
          </Text>

          <ActionLink href={`/wards/book-a-visit`}>
            Book a virtual visit
          </ActionLink>

          <h2 className="nhsuk-heading-l">Pre-booked virtual visits</h2>

          {scheduledCalls.length > 0 ? (
            <VisitsTable visits={scheduledCalls} />
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
    async ({ authenticationToken, container }) => {
      const { scheduledCalls, error } = await retrieveVisits(container);

      return {
        props: { scheduledCalls, error, wardId: authenticationToken.ward },
      };
    },
    {
      tokens: new TokenProvider(process.env.JWT_SIGNING_KEY),
    }
  )
);
