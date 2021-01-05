import React from "react";
import Error from "next/error";
import { GridRow, GridColumn } from "../../../../src/components/Grid";
import Layout from "../../../../src/components/Layout";
import verifyTrustAdminToken from "../../../../src/usecases/verifyTrustAdminToken";
import propsWithContainer from "../../../../src/middleware/propsWithContainer";
import SummaryList from "../../../../src/components/SummaryList";
import FormHeading from "../../../../src/components/FormHeading";
import Button from "../../../../src/components/Button";
import BackLink from "../../../../src/components/BackLink";
import Router from "next/router";
import { TRUST_ADMIN } from "../../../../src/helpers/userTypes";
import Form from "../../../../src/components/Form";
import TrustAdminHeading from "../../../../src/components/TrustAdminHeading";

const ArchiveATrustManagerConfirmation = ({ trust, trustManager, error }) => {
  if (error) {
    return <Error />;
  }

  const trustManagerSummaryList = [
    { key: "Email", value: trustManager.email },
    { key: "Status", value: trustManager.status },
  ];

  const onSubmit = async () => {
    Router.push({
      pathname: `/trust-admin/trust-managers/${trustManager.id}/archive-success`,
      query: { uuid: trustManager.uuid },
    });
  };

  return (
    <Layout
      title="Are you sure you want to delete this ward?"
      showNavigationBar={true}
      showNavigationBarForType={TRUST_ADMIN}
    >
      <TrustAdminHeading trustName={trust.name} subHeading="Trust Managers" />
      <GridRow>
        <GridColumn width="full">
          <FormHeading>
            Are you sure you want to delete this trust manager?
          </FormHeading>
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn width="two-thirds">
          <Form onSubmit={onSubmit}>
            <SummaryList
              list={trustManagerSummaryList}
              withActions={false}
            ></SummaryList>

            <Button>Yes, delete this trust manager</Button>
            <BackLink
              href={`/trust-admin/trust-managers/`}
            >{`Back to Trust Managers`}</BackLink>
          </Form>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyTrustAdminToken(async ({ container, query, authenticationToken }) => {
    const trustResponse = await container.getRetrieveTrustById()(
      authenticationToken.trustId
    );
    const trustManagerId = query.uuid;
    /*** Trust Manager Array needs to swapped out with info from db once available *****/
    const trustManagers = [
      {
        uuid: "8626856E-2AA4-4F19-89FD-9C0E6FD8EB0B",
        email: "nhs-org2@nhs.co.uk",
        status: "active",
      },
    ];
    const error = "";
    const trustManager = trustManagers?.find(
      (manager) => manager.uuid === trustManagerId
    );
    if (error) {
      return {
        props: {
          error,
        },
      };
    }
    return {
      props: {
        trust: { name: trustResponse.trust?.name },
        trustManager,
      },
    };
  })
);

export default ArchiveATrustManagerConfirmation;
