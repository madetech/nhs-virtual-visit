import React from "react";
import { GridRow, GridColumn } from "../src/components/Grid";
import Heading from "../src/components/Heading";
import Layout from "../src/components/Layout";
import AnchorLink from "../src/components/AnchorLink";

const LandingPage = () => {
  return (
    <Layout title="NHS Virtual Visit">
      <GridRow>
        <GridColumn width="two-thirds">
          <Heading>NHS Virtual Visit</Heading>
          <p>Use this service to:</p>
          <ul>
            <li data-cy="admin-and-manager-login-link"><AnchorLink href="/login"> Manage Your Trust</AnchorLink></li>
            <li data-cy="ward-book-a-visit-link"><AnchorLink href="/wards/login">Book a Virtual Visit</AnchorLink></li>
          </ul>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export default LandingPage;