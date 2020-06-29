import React, { useState, useCallback } from "react";
import ErrorSummary from "../../../src/components/ErrorSummary";
import { GridRow, GridColumn } from "../../../src/components/Grid";
import Layout from "../../../src/components/Layout";
import verifyTrustAdminToken from "../../../src/usecases/verifyTrustAdminToken";
import propsWithContainer from "../../../src/middleware/propsWithContainer";
import Error from "next/error";
import FormGroup from "../../../src/components/FormGroup";
import Heading from "../../../src/components/Heading";
import Input from "../../../src/components/Input";
import Label from "../../../src/components/Label";
import Button from "../../../src/components/Button";
import Router from "next/router";
import { TRUST_ADMIN } from "../../../src/helpers/userTypes";

const AddAHospital = ({ error, trustId }) => {
  if (error) {
    return <Error />;
  }
  const [errors, setErrors] = useState([]);
  const [hospitalName, setHospitalName] = useState("");

  const hasError = (field) =>
    errors.find((error) => error.id === `${field}-error`);

  const errorMessage = (field) => {
    const error = errors.filter((err) => err.id === `${field}-error`);
    return error.length === 1 ? error[0].message : "";
  };

  const onSubmit = useCallback(async (event) => {
    event.preventDefault();
    const onSubmitErrors = [];

    const setHospitalNameError = (errors) => {
      errors.push({
        id: "hospital-name-error",
        message: "Enter a hospital name",
      });
    };

    const setHospitalUniqueError = (errors, err) => {
      errors.push({
        id: "hospital-name-error",
        message: err,
      });
    };

    if (hospitalName.length === 0) {
      setHospitalNameError(onSubmitErrors);
    }

    if (onSubmitErrors.length === 0) {
      const submitAnswers = async (name) => {
        const response = await fetch("/api/create-hospital", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name,
            trustId,
          }),
        });

        const status = response.status;

        if (status == 201) {
          const { hospitalId } = await response.json();
          Router.push({
            pathname: `/trust-admin/hospitals/${hospitalId}/add-success`,
          });
        } else if (status === 400) {
          const { err } = await response.json();
          setHospitalUniqueError(onSubmitErrors, err);
        } else {
          onSubmitErrors.push({
            message: "Something went wrong, please try again later.",
          });
          setErrors(onSubmitErrors);
        }
      };

      await submitAnswers(hospitalName);
    }
    setErrors(onSubmitErrors);
  });

  return (
    <Layout
      title="Add a hospital"
      hasErrors={errors.length != 0}
      showNavigationBar={true}
      showNavigationBarForType={TRUST_ADMIN}
    >
      <GridRow>
        <GridColumn width="two-thirds">
          <ErrorSummary errors={errors} />
          <form onSubmit={onSubmit}>
            <Heading>Add a hospital</Heading>
            <FormGroup>
              <Label htmlFor="hospital-name" className="nhsuk-label--l">
                What is the hospital name?
              </Label>
              <Input
                id="hospital-name"
                type="text"
                hasError={hasError("hospital-name")}
                errorMessage={errorMessage("hospital-name")}
                className="nhsuk-u-font-size-32 nhsuk-input--width-10"
                style={{ padding: "16px!important", height: "64px" }}
                onChange={(event) => setHospitalName(event.target.value)}
                name="hospital-name"
                autoComplete="off"
                value={hospitalName || ""}
              />
            </FormGroup>
            <Button className="nhsuk-u-margin-top-5">Add hospital</Button>
          </form>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyTrustAdminToken(async ({ authenticationToken }) => {
    const trustId = authenticationToken.trustId;
    return {
      props: {
        trustId,
      },
    };
  })
);

export default AddAHospital;
