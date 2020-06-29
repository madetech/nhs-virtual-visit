import React from "react";
import Link from "next/link";
import { GridRow, GridColumn } from "../../src/components/Grid";
import Text from "../../src/components/Text";
import Heading from "../../src/components/Heading";
import Layout from "../../src/components/Layout";
import verifyToken from "../../src/usecases/verifyToken";
import propsWithContainer from "../../src/middleware/propsWithContainer";
import { WARD_STAFF } from "../../src/helpers/userTypes";

const BookAVisitStart = () => {
  return (
    <Layout
      title="Before booking a virtual visit"
      showNavigationBarForType={WARD_STAFF}
      showNavigationBar={true}
    >
      <GridRow>
        <GridColumn width="two-thirds">
          <Heading>Before booking a virtual visit</Heading>

          <Text>
            Contact the visitor of the patient and agree a date and time for
            their virtual visit.
          </Text>
          <Text>
            You&apos;ll need their mobile number or email address so a
            confirmation is sent to them.
          </Text>

          <Link href="/wards/book-a-visit">
            <a className="nhsuk-button">Start now</a>
          </Link>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyToken(() => {
    return { props: {} };
  })
);

export default BookAVisitStart;
