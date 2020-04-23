import Layout from "../src/components/Layout";
import { GridRow, GridColumn } from "../src/components/Grid";
import Heading from "../src/components/Heading";
import Text from "../src/components/Text";

function Error() {
  return (
    <Layout title="Sorry, there is a problem with the service">
      <GridRow>
        <GridColumn width="two-thirds">
          <Heading>Sorry, there is a problem with the service</Heading>
          <Text>We were unable to process your request, try again later.</Text>
        </GridColumn>
      </GridRow>
    </Layout>
  );
}

export default Error;
