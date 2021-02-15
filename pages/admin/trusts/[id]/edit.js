import React, { useState } from "react";
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
import Form from "../../../../src/components/Form";
import Router from "next/router";
import { ADMIN } from "../../../../src/helpers/userTypes";
import {
  VIDEO_PROVIDER_OPTIONS,
  VIDEO_PROVIDERS,
} from "../../../../src/providers/CallIdProvider";
import {
  hasError,
  errorMessage,
} from "../../../../src/helpers/pageErrorHandler";

const EditTrust = ({ trust }) => {
  const [errors, setErrors] = useState([]);
  const [videoProvider, setVideoProvider] = useState(trust.videoProvider);

  const onSubmit = async () => {
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
          Router.push(
            "/admin/trusts/[id]/edit-success",
            `/admin/trusts/${trust.id}/edit-success`
          );
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

      return await submitAnswers(name);
    }
    setErrors(onSubmitErrors);
  };

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
          <Form onSubmit={onSubmit}>
            <Heading>{`Edit ${trust.name}`}</Heading>

            <FormGroup>
              <Label htmlFor="video-provider" className="nhsuk-label--m">
                Which video provider would you like to use?
              </Label>
              <Select
                id="video-provider"
                className="nhsuk-u-width-one-half"
                prompt="Choose a provider"
                options={VIDEO_PROVIDER_OPTIONS}
                onChange={(event) => {
                  setVideoProvider(event.target.value);
                }}
                hasError={hasError(errors, "video-provider")}
                errorMessage={errorMessage(errors, "video-provider")}
                name="video-provider"
                defaultValue={
                  VIDEO_PROVIDERS.includes(videoProvider) ? videoProvider : null
                }
              />
            </FormGroup>
            <Button className="nhsuk-u-margin-top-5">Edit Trust</Button>
          </Form>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyAdminToken(async ({ container, query }) => {
    const { id: trustId } = query;

    const { trust, error } = await container.getRetrieveOrganisationById()(
      trustId
    );

    return {
      props: {
        trust,
        error,
      },
    };
  })
);

export default EditTrust;
