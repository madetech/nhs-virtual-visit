import React, { useState } from "react";
import Error from "next/error";
import { GridRow, GridColumn } from "../../../../../../src/components/Grid";
import Layout from "../../../../../../src/components/Layout";
import verifyTrustAdminToken from "../../../../../../src/usecases/verifyTrustAdminToken";
import propsWithContainer from "../../../../../../src/middleware/propsWithContainer";
import SummaryList from "../../../../../../src/components/SummaryList";
import Heading from "../../../../../../src/components/Heading";
import Button from "../../../../../../src/components/Button";
import BackLink from "../../../../../../src/components/BackLink";
import Router from "next/router";
import { TRUST_ADMIN } from "../../../../../../src/helpers/userTypes";
import Form from "../../../../../../src/components/Form";
import TrustAdminHeading from "../../../../../../src/components/TrustAdminHeading";

const ArchiveAWardConfirmation = ({ error, ward, organisation, hospital }) => {
  const [hasError, setHasError] = useState(error);
  const { name, hospitalId } = ward;
  if (hasError) {
    return <Error />;
  }

  const wardSummaryList = [
    { key: "Name", value: name },
    { key: "Hospital", value: hospital.name },
  ];

  const onSubmit = async () => {
    const response = await fetch("/api/archive-department", {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        uuid: ward.uuid,
      }),
    });
    if (response.status === 200) {
      Router.push(
        `/trust-admin/hospitals/${hospital.uuid}/wards/${ward.uuid}/archive-ward-success?hospitalName=${hospital.name}`
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
        subHeading={hospital.name}
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
            >{`Back to ${hospital.name}`}</BackLink>
          </Form>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyTrustAdminToken(
    async ({ container, params, query, authenticationToken }) => {
      const wardUuid = params?.wardUuid;
      const hospitalUuid = params?.hospitalUuid;
      const hospitalName = query?.hospitalName;
      const orgId = authenticationToken.trustId;
      const {
        organisation,
        error: organisationError,
      } = await container.getRetrieveOrganisationById()(orgId);
      const {
        department,
        error: departmentError,
      } = await container.getRetrieveDepartmentByUuid()(wardUuid);
      const queryOrParamsError =
        !hospitalName || !hospitalUuid || !wardUuid ? true : null;

      return {
        props: {
          error: organisationError || departmentError || queryOrParamsError,
          ward: department,
          hospital: { name: hospitalName, uuid: hospitalUuid },
          organisation,
        },
      };
    }
  )
);

export default ArchiveAWardConfirmation;
