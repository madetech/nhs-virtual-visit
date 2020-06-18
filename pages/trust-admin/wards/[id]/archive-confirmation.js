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

const ArchiveAWardConfirmation = ({
  error,
  id,
  name,
  hospitalName,
  trustId,
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

  const onSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch("/api/archive-ward", {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name,
        hospitalName,
        trustId,
        wardId: id,
      }),
    });
    if (response.status === 200) {
      Router.push(
        `/trust-admin/wards/archive-success?name=${name}&hospitalName=${hospitalName}&hospitalId=${hospitalId}`
      );
    } else {
      setHasError(true);
    }
  };

  return (
    <Layout
      title="Are you sure you want to delete this ward?"
      renderLogout={true}
      showNavigationBar={true}
      showNavigationBarForType={TRUST_ADMIN}
    >
      <GridRow>
        <GridColumn width="full">
          <Heading>Are you sure you want to delete this ward?</Heading>
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn width="two-thirds">
          <form onSubmit={onSubmit}>
            <SummaryList
              list={wardSummaryList}
              withActions={false}
            ></SummaryList>
            <p>All booked visits for this ward will be cancelled.</p>

            <Button>Yes, delete this ward</Button>
            <BackLink
              href={`/trust-admin/hospitals/${hospitalId}`}
            >{`Back to ${hospitalName}`}</BackLink>
          </form>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyTrustAdminToken(async ({ container, query, authenticationToken }) => {
    const getRetrieveWardById = container.getRetrieveWardById();

    const { ward, error } = await getRetrieveWardById(
      query.id,
      authenticationToken.trustId
    );

    if (error) {
      return { props: { error: error } };
    } else {
      return {
        props: {
          error: error,
          id: ward.id,
          name: ward.name,
          hospitalName: ward.hospitalName,
          trustId: authenticationToken.trustId,
          hospitalId: ward.hospitalId,
        },
      };
    }
  })
);

export default ArchiveAWardConfirmation;
