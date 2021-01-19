import React, { useState } from "react";
import Error from "next/error";
import { GridRow, GridColumn } from "../../../../src/components/Grid";
import Layout from "../../../../src/components/Layout";
import verifyTrustAdminToken from "../../../../src/usecases/verifyTrustAdminToken";
import propsWithContainer from "../../../../src/middleware/propsWithContainer";
import SummaryList from "../../../../src/components/SummaryList";
import Heading from "../../../../src/components/Heading";
import Button from "../../../../src/components/Button";
import BackLink from "../../../../src/components/BackLink";
import Router from "next/router";
import { TRUST_ADMIN } from "../../../../src/helpers/userTypes";
import Form from "../../../../src/components/Form";
import TrustAdminHeading from "../../../../src/components/TrustAdminHeading";

const ArchiveAWardConfirmation = ({
  error,
  id,
  name,
  hospitalName,
  organisation,
  hospitalId,
}) => {
  const [hasError, setHasError] = useState(error);

  if (hasError) {
    return <Error />;
  }

  const wardSummaryList = [
    { key: "Name", value: name },
    { key: "Hospital", value: hospitalName },
  ];

  const onSubmit = async () => {
    const response = await fetch("/api/archive-ward", {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name,
        hospitalName,
        trustId: organisation.id,
        wardId: id,
      }),
    });
    if (response.status === 200) {
      Router.push(
        `/trust-admin/wards/archive-success?name=${name}&hospitalName=${hospitalName}&hospitalId=${hospitalId}`
      );
      return true;
    } else {
      setHasError(true);
    }
    return false;
  };

  return (
    <Layout
      title="Are you sure you want to delete this ward?"
      showNavigationBar={true}
      showNavigationBarForType={TRUST_ADMIN}
    >
      <TrustAdminHeading
        trustName={`${organisation.name}`}
        subHeading="Trust Managers"
      />
      <GridRow>
        <GridColumn width="full">
          <Heading>Are you sure you want to delete this ward?</Heading>
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn width="two-thirds">
          <Form onSubmit={onSubmit}>
            <SummaryList list={wardSummaryList} withActions={false} />
            <p>All booked visits for this ward will be cancelled.</p>

            <Button>Yes, delete this ward</Button>
            <BackLink
              href={`/trust-admin/hospitals/${hospitalId}`}
            >{`Back to ${hospitalName}`}</BackLink>
          </Form>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyTrustAdminToken(async ({ container, query, authenticationToken }) => {
    const orgId = authenticationToken.trustId;
    const {
      organisation,
      error: organisationError,
    } = await container.getRetrieveOrganisationById()(orgId);
    const { ward, error: wardError } = await container.getRetrieveWardById()(
      query.id,
      orgId
    );

    return {
      props: {
        error: organisationError || wardError,
        id: ward.id,
        name: ward.name,
        hospitalName: ward.hospitalName,
        organisation,
        hospitalId: ward.hospitalId,
      },
    };
  })
);

export default ArchiveAWardConfirmation;
