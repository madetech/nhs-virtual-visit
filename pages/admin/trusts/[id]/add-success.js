import React from "react";
import Error from "next/error";
import Layout from "../../../../src/components/Layout";
import AnchorLink from "../../../../src/components/AnchorLink";
import propsWithContainer from "../../../../src/middleware/propsWithContainer";
import verifyAdminToken from "../../../../src/usecases/verifyAdminToken";
import ActionLink from "../../../../src/components/ActionLink";
import { ADMIN } from "../../../../src/helpers/userTypes";

const AddATrustSuccess = ({ error, name }) => {
  if (error) {
    return <Error />;
  }

  return (
    <Layout
      title={`${name} has been added`}
      showNavigationBarForType={ADMIN}
      showNavigationBar={true}
    >
      <div className="nhsuk-grid-row">
        <div className="nhsuk-grid-column-two-thirds">
          <div
            className="nhsuk-panel nhsuk-panel--confirmation nhsuk-u-margin-top-0 nhsuk-u-margin-bottom-4"
            style={{ textAlign: "center" }}
          >
            <h1 className="nhsuk-panel__title">{name} has been added</h1>
          </div>
          <h2>What happens next</h2>

          <ActionLink href={`/admin/trusts/add-a-trust`}>
            Add another trust
          </ActionLink>

          <p>
            <AnchorLink href="/admin">Return to site administration</AnchorLink>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyAdminToken(async ({ container, query }) => {
    const getRetrieveTrustById = container.getRetrieveTrustById();
    const { trust, error } = await getRetrieveTrustById(query.id);

    if (error) {
      return { props: { error: error } };
    } else {
      return {
        props: {
          error: error,
          name: trust.name,
        },
      };
    }
  })
);

export default AddATrustSuccess;
