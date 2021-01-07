import React, { useState } from "react";
import Error from "next/error";
import { GridRow, GridColumn } from "../../../../src/components/Grid";
import ErrorSummary from "../../../../src/components/ErrorSummary";
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
    return <Error err={error} />;
  }
  const [errors, setErrors] = useState([]);
  const trustManagerSummaryList = [
    { key: "Email", value: trustManager.email },
    { key: "Status", value: trustManager.status },
  ];

  const onSubmit = async () => {
    try {
      const response = await fetch("/api/archive-manager", {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          uuid: trustManager.uuid,
        }),
      });

      if (response.status === 200) {
        Router.push({
          pathname: `/trust-admin/trust-managers/${trustManager.uuid}/archive-success`,
          query: { email: trustManager.email },
        });
      } else {
        const { error } = await response.json();
        throw new Error(error);
      }
    } catch (e) {
      const onSubmitErrors = [
        {
          id: "manager-delete-error",
          message: "There was a problem deleting a manager.",
        },
      ];
      setErrors(onSubmitErrors);
    }
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
          <ErrorSummary errors={errors} />
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
    const orgManagerUuid = query.uuid;

    const {
      trustManager,
      error,
    } = await container.getRetrieveOrgManagerByUuid()(orgManagerUuid);

    return {
      props: {
        trust: { name: trustResponse.trust?.name },
        trustManager,
        error,
      },
    };
  })
);

export default ArchiveATrustManagerConfirmation;
