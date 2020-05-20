import React from "react";
import Error from "next/error";
import { GridRow, GridColumn } from "../../src/components/Grid";
import Layout from "../../src/components/Layout";
import verifyAdminToken from "../../src/usecases/verifyAdminToken";
import propsWithContainer from "../../src/middleware/propsWithContainer";
import SummaryList from "../../src/components/SummaryList";
import Heading from "../../src/components/Heading";
import Button from "../../src/components/Button";
import BackLink from "../../src/components/BackLink";
import Router from "next/router";

const ArchiveAWardConfirmation = ({
  error,
  id,
  name,
  hospitalName,
  trustId,
}) => {
  if (error) {
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
        `/admin/archive-a-ward-success?name=${name}&hospitalName=${hospitalName}`
      );
    }
  };

  return (
    <Layout
      title="Are you sure you want to delete this ward?"
      renderLogout={true}
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
            <div className="nhsuk-warning-callout">
              <h3 className="nhsuk-warning-callout__label">Info</h3>
              <p>
                It is import to know when deleting this ward that all associated
                calls will also be deleted
              </p>
            </div>

            <Button>Yes, delete this ward</Button>
            <BackLink href="/admin">Back to ward administration</BackLink>
          </form>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyAdminToken(async ({ container, query, authenticationToken }) => {
    const getRetrieveWardById = container.getRetrieveWardById();

    const { ward, error } = await getRetrieveWardById(
      query.wardId,
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
        },
      };
    }
  })
);

export default ArchiveAWardConfirmation;
