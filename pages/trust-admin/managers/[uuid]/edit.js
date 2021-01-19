import React, { useState } from "react";
import Error from "next/error";
import Router from "next/router";
import propsWithContainer from "../../../../src/middleware/propsWithContainer";
import verifyTrustAdminToken from "../../../../src/usecases/verifyTrustAdminToken";
import { GridRow, GridColumn } from "../../../../src/components/Grid";
import Layout from "../../../../src/components/Layout";
import { TRUST_ADMIN } from "../../../../src/helpers/userTypes";
import ManagerForm from "../../../../src/components/ManagerForm";
import ErrorSummary from "../../../../src/components/ErrorSummary";
import TrustAdminHeading from "../../../../src/components/TrustAdminHeading";

const EditManager = ({ error, manager, organisation }) => {
  if (error) {
    return <Error err={error} />;
  }

  const [errors, setErrors] = useState([]);
  const submit = async (payload) => {
    payload.uuid = manager.uuid;

    try {
      const response = await fetch("/api/update-a-manager-status", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 200) {
        const json = await response.json();
        Router.push({
          pathname: `/trust-admin/managers/${json.uuid}/edit-success`,
          query: { uuid: manager.uuid },
        });
      } else {
        throw new Error(response.status);
      }
    } catch (e) {
      const onSubmitErrors = [
        {
          id: "manager-update-error",
          message: "There was a problem saving your changes",
        },
      ];
      setErrors(onSubmitErrors);
    }
  };

  return (
    <Layout
      title="Edit a Manager"
      hasErrors={errors.length != 0}
      showNavigationBar={true}
      showNavigationBarForType={TRUST_ADMIN}
    >
      <TrustAdminHeading trustName={organisation.name} subHeading="Managers" />
      <GridRow>
        <GridColumn width="two-thirds">
          <ErrorSummary errors={errors} />
          <ManagerForm
            errors={errors}
            setErrors={setErrors}
            manager={manager}
            submit={submit}
          />
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyTrustAdminToken(async ({ authenticationToken, container, query }) => {
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
        manager,
        organisation,
        error: managerError || organisationError,
      },
    };
  })
);

export default EditManager;
