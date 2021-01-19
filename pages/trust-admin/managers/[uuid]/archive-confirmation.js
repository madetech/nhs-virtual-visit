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

const ArchiveAManagerConfirmation = ({ organisation, manager, error }) => {
  if (error) {
    return <Error err={error} />;
  }
  const [errors, setErrors] = useState([]);
  const managerSummaryList = [
    { key: "Email", value: manager.email },
    { key: "Status", value: manager.status },
  ];

  const onSubmit = async () => {
    try {
      const response = await fetch("/api/archive-manager", {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          uuid: manager.uuid,
        }),
      });

      if (response.status === 200) {
        Router.push({
          pathname: `/trust-admin/managers/${manager.uuid}/archive-success`,
          query: { email: manager.email },
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
      title="Are you sure you want to delete this manager?"
      showNavigationBar={true}
      showNavigationBarForType={TRUST_ADMIN}
    >
      <TrustAdminHeading trustName={organisation.name} subHeading="Managers" />
      <GridRow>
        <GridColumn width="full">
          <ErrorSummary errors={errors} />
          <FormHeading>
            Are you sure you want to delete this manager?
          </FormHeading>
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn width="two-thirds">
          <Form onSubmit={onSubmit}>
            <SummaryList
              list={managerSummaryList}
              withActions={false}
            ></SummaryList>

            <Button>Yes, delete this manager</Button>
            <BackLink
              href={`/trust-admin/managers/`}
            >{`Back to Trust Managers`}</BackLink>
          </Form>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyTrustAdminToken(async ({ container, query, authenticationToken }) => {
    const {
      organisation,
      error: organisationError,
    } = await container.getRetrieveOrganisationById()(
      authenticationToken.trustId
    );
    const managerUuid = query.uuid;

    const {
      manager,
      error: managerError,
    } = await container.getRetrieveManagerByUuid()(managerUuid);

    return {
      props: {
        organisation,
        manager,
        error: organisationError || managerError,
      },
    };
  })
);

export default ArchiveAManagerConfirmation;
