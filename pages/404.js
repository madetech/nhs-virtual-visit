import React from "react";
import Layout from "../src/components/Layout";
import { GridRow, GridColumn } from "../src/components/Grid";
import Heading from "../src/components/Heading";
import Text from "../src/components/Text";

export default function Custom404() {
  return (
    <Layout title="We can’t find the page you’re looking for">
      <GridRow>
        <GridColumn width="two-thirds">
          <Text>{JSON.stringify(process.env)}</Text>
          <Heading>We can’t find the page you’re looking for</Heading>
          <Text>If you typed the web address, check it is correct.</Text>
          <Text>
            If you pasted the web address, check you copied the entire address.
          </Text>
        </GridColumn>
      </GridRow>
    </Layout>
  );
}
