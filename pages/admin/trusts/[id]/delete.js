import React, { useState } from "react";
import Layout from "../../../../src/components/Layout";
import propsWithContainer from "../../../../src/middleware/propsWithContainer";
import verifyAdminToken from "../../../../src/usecases/verifyAdminToken";
import Error from "next/error";
import { ADMIN } from "../../../../src/helpers/userTypes";
import { GridColumn, GridRow } from "../../../../src/components/Grid";
import ErrorSummary from "../../../../src/components/ErrorSummary";
import FormHeading from "../../../../src/components/FormHeading";
import Form from "../../../../src/components/Form";
import Button from "../../../../src/components/Button";
import BackLink from "../../../../src/components/BackLink";
import Router from "next/router";

const Delete = ({ organisation, error }) => {
  if (error) {
    return <Error err={error} />;
  }

  const [errors, setErrors] = useState([]);
  const onSubmit = async () => {
    const onSubmitErrors = [];

    if (onSubmitErrors.length === 0) {
      const submitAnswers = async () => {
        const response = await fetch("/api/delete-organisation", {
          method: "DELETE",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            id: organisation.id,
          }),
        });

        const status = response.status;

        if (status === 204) {
          await Router.push("/admin/trusts", `/admin/trusts`);
          return true;
        } else {
          onSubmitErrors.push({
            id: "generic-error",
            message: "Something went wrong, please try again later.",
          });
          setErrors(onSubmitErrors);
        }

        return false;
      };

      return await submitAnswers();
    }
    setErrors(onSubmitErrors);
  };

  return (
    <Layout
      title="Confirm deletion"
      showNavigationBarForType={ADMIN}
      showNavigationBar={true}
    >
      <GridRow>
        <GridColumn width="full">
          <ErrorSummary errors={errors} />
          <FormHeading>
            Are you sure you want to delete {organisation.name}?
          </FormHeading>
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn width="two-thirds">
          <Form onSubmit={onSubmit}>
            <Button>Yes</Button>
            <BackLink
              href={`/admin/trusts`}
            >{`Back to Organisations`}</BackLink>
          </Form>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyAdminToken(async ({ container, query }) => {
    const { id } = query;
    const {
      organisation,
      error,
    } = await container.getRetrieveOrganisationById()(id);

    return {
      props: { organisation, error },
    };
  })
);

export default Delete;
