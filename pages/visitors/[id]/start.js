import React from "react";
import { useRouter } from "next/router";
import { GridRow, GridColumn } from "../../../src/components/Grid";
import Layout from "../../../src/components/Layout";
import Heading from "../../../src/components/Heading";
import Lead from "../../../src/components/Lead";
import Text from "../../../src/components/Text";
import Button from "../../../src/components/Button";

const Start = () => {
  const router = useRouter();
  const onClick = () => router.push(`/visitors/${router.query.id}/name`);

  return (
    <Layout title="Attend a virtual visit">
      <GridRow>
        <GridColumn width="two-thirds">
          <Heading>Attend a virtual visit</Heading>
          <Lead>
            Attend a virtual visit is a new service for the London North West
            University Healthcare Trust being trialled to connect patients with
            their visitor via virtual visits.
          </Lead>

          <h2 className="nhsuk-heading-l">Confirm the patient's identity</h2>

          <Text>
            You must be ready to confirm the <b>patient name</b> and{" "}
            <b>date of birth</b> to the NHS staff member when you join the video
            call.
          </Text>

          <h2 className="nhsuk-heading-l">Do not take screenshots</h2>

          <Text>
            During your virtual visit you <b>must not take screenshots</b>, as
            this will break patient confidentiality.
          </Text>

          <Text>
            Please be aware that this is not a medical visit and medical
            questions may not be answered.
          </Text>

          <Button onClick={onClick}>Start now</Button>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export default Start;
