import React from "react";
import Button from "../src/components/Button";
import { GridRow, GridColumn } from "../src/components/Grid";
import Heading from "../src/components/Heading";
import Layout from "../src/components/Layout";
import AnchorLink from "../src/components/AnchorLink";
import Router from "next/router";

const LandingPage = () => {
  const goToSignUpPage = () =>{
    Router.push("/sign-up");
  }
  return (
    <Layout title="NHS Virtual Visit">
      <GridRow>
        <GridColumn width="two-thirds">
          <Heading>NHS Virtual Visit</Heading>
          <p>Use this service to:</p>
          <ul>
            <li><AnchorLink href="/login"> Manage Your Trust</AnchorLink></li>
            <li><AnchorLink href="/wards/login">Book a Virtual Visit</AnchorLink></li>
          </ul>
          <p>Registering takes around 5 minutes.</p>
          <Button onClick={goToSignUpPage}>Start now</Button>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export default LandingPage;