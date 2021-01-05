import React, { useState } from "react";
import ErrorSummary from "../../../src/components/ErrorSummary";
import { GridRow, GridColumn } from "../../../src/components/Grid";
import Layout from "../../../src/components/Layout";
import verifyAdminToken from "../../../src/usecases/verifyAdminToken";
import propsWithContainer from "../../../src/middleware/propsWithContainer";
import FormGroup from "../../../src/components/FormGroup";
import Heading from "../../../src/components/Heading";
import Input from "../../../src/components/Input";
import Label from "../../../src/components/Label";
import Button from "../../../src/components/Button";
import Form from "../../../src/components/Form";
import Router from "next/router";
import { ADMIN } from "../../../src/helpers/userTypes";

const AddATrust = () => {
  const [errors, setErrors] = useState([]);
  const [name, setName] = useState("");

  const hasError = (field) =>
    errors.find((error) => error.id === `${field}-error`);

  const errorMessage = (field) => {
    const error = errors.filter((err) => err.id === `${field}-error`);
    return error.length === 1 ? error[0].message : "";
  };

  const onSubmit = async () => {
    const onSubmitErrors = [];

    const setNameError = (errorsArr) => {
      errorsArr.push({
        id: "trust-name-error",
        message: "Enter a trust name",
      });
    };

    if (name.length === 0) {
      setNameError(onSubmitErrors);
    }

    if (onSubmitErrors.length === 0) {
      const submitTrust = async (name) => {

        const response = await fetch("/api/create-organization", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name,
            status: 0,
          }),
        });

        const status = response.status;

        if (status == 201) {
          const { organizationId } = await response.json();
          Router.push(
            "/admin/trusts/[id]/add-success",
            `/admin/trusts/${organizationId}/add-success`
          );
          return true;
        } else if (status === 409) {
          const { err } = await response.json();
          onSubmitErrors.push({
            id: "trust-name-existing-error",
            message: err,
          });
        } else {
          onSubmitErrors.push({
            id: "generic-error",
            message: "Something went wrong, please try again later.",
          });
        }
        setErrors(onSubmitErrors);
        return false;
      };
      return await submitTrust(name);
    }
    setErrors(onSubmitErrors);
  };

  return (
    <Layout
      title="Add a trust"
      hasErrors={errors.length != 0}
      showNavigationBarForType={ADMIN}
      showNavigationBar={true}
    >
      <GridRow>
        <GridColumn width="two-thirds">
          <ErrorSummary errors={errors} />
          <Form onSubmit={onSubmit}>
            <Heading>Add a trust</Heading>
            <FormGroup>
              <Label htmlFor="trust-name" className="nhsuk-label--m">
                Trust name
              </Label>
              <Input
                id="trust-name"
                type="text"
                hasError={hasError("trust-name")}
                errorMessage={errorMessage("trust-name")}
                className="nhsuk-input--width-20"
                onChange={(event) => setName(event.target.value)}
                name="trust-name"
                autoComplete="off"
                value={name || ""}
              />
            </FormGroup>
            <Button className="nhsuk-u-margin-top-5">Add trust</Button>
          </Form>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyAdminToken(() => ({ props: {} }))
);

export default AddATrust;
