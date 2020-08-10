import React, { useState, useCallback } from "react";
import ErrorSummary from "../../../../src/components/ErrorSummary";
import { GridRow, GridColumn } from "../../../../src/components/Grid";
import Layout from "../../../../src/components/Layout";
import verifyAdminToken from "../../../../src/usecases/verifyAdminToken";
import propsWithContainer from "../../../../src/middleware/propsWithContainer";
import FormGroup from "../../../../src/components/FormGroup";
import Heading from "../../../../src/components/Heading";
import Label from "../../../../src/components/Label";
import Button from "../../../../src/components/Button";
import Select from "../../../../src/components/Select";
import Router from "next/router";
import { ADMIN } from "../../../../src/helpers/userTypes";
import {
  VIDEO_PROVIDER_OPTIONS,
  VIDEO_PROVIDERS,
} from "../../../../src/providers/CallIdProvider";

const EditTrust = ({ trust }) => {
  const [errors, setErrors] = useState([]);
  const [videoProvider, setVideoProvider] = useState(trust.videoProvider);

  const hasError = (field) =>
    errors.find((error) => error.id === `${field}-error`);

  const getErrorMessage = (field) => {
    const error = errors.filter((err) => err.id === `${field}-error`);
    return error.length === 1 ? error[0].message : "";
  };

  const onSubmit = useCallback(async (event) => {
    event.preventDefault();
    const onSubmitErrors = [];

    if (videoProvider.length === 0) {
      onSubmitErrors.push({
        id: "video-provider-error",
        message: "Select a video provider",
      });
    }

    if (onSubmitErrors.length === 0) {
      const submitAnswers = async () => {
        const response = await fetch("/api/update-a-trust", {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            id: trust.id,
            videoProvider,
          }),
        });

        const status = response.status;

        if (status == 200) {
          Router.push({
            pathname: `/admin/trusts/${trust.id}/edit-success`,
          });
        } else {
          onSubmitErrors.push({
            message: "Something went wrong, please try again later.",
          });
          setErrors(onSubmitErrors);
        }
      };

      await submitAnswers(name);
    }
    setErrors(onSubmitErrors);
  });

  return (
    <Layout
      title={`Edit ${trust.name}`}
      hasErrors={errors.length != 0}
      showNavigationBarForType={ADMIN}
      showNavigationBar={true}
    >
      <GridRow>
        <GridColumn width="two-thirds">
          <ErrorSummary errors={errors} />
          <form onSubmit={onSubmit}>
            <Heading>{`Edit ${trust.name}`}</Heading>

            <FormGroup>
              <Label htmlFor="video-provider" className="nhsuk-label--l">
                Which video provider would you like to use?
              </Label>
              <Select
                id="video-provider"
                className="nhsuk-input--width-10 nhsuk-u-width-one-half"
                prompt="Choose a provider"
                options={VIDEO_PROVIDER_OPTIONS}
                onChange={(event) => {
                  setVideoProvider(event.target.value);
                }}
                hasError={hasError("video-provider")}
                errorMessage={getErrorMessage("video-provider")}
                name="video-provider"
                defaultValue={
                  VIDEO_PROVIDERS.includes(videoProvider) ? videoProvider : null
                }
              />
            </FormGroup>
            <Button className="nhsuk-u-margin-top-5">Edit Trust</Button>
          </form>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyAdminToken(async ({ container, query }) => {
    const { id: trustId } = query;

    const { trust, error } = await container.getRetrieveTrustById()(trustId);

    return {
      props: {
        trust,
        error,
      },
    };
  })
);

export default EditTrust;
