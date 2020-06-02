import React from "react";
import Link from "next/link";
import { GridRow, GridColumn } from "../../src/components/Grid";
import Text from "../../src/components/Text";
import Heading from "../../src/components/Heading";
import Layout from "../../src/components/Layout";
import verifyToken from "../../src/usecases/verifyToken";
import propsWithContainer from "../../src/middleware/propsWithContainer";

const BookAVisitStart = ({ showNavigationBar }) => {
  return (
    <Layout
      title="Before booking a virtual visit"
      showNavigationBarForType="wardStaff"
      renderLogout={true}
      showNavigationBar={showNavigationBar}
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
    const showNavigationBar = process.env.SHOW_NAVIGATION_BAR === "yes";

    return { props: { showNavigationBar } };
  })
);

export default BookAVisitStart;
