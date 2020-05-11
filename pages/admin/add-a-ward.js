import React, { useState } from "react";
import { GridRow, GridColumn } from "../../src/components/Grid";
import Layout from "../../src/components/Layout";
import verifyAdminToken from "../../src/usecases/verifyAdminToken";
import TokenProvider from "../../src/providers/TokenProvider";
import propsWithContainer from "../../src/middleware/propsWithContainer";
import WardForm from "../../src/components/WardForm";

const AddAWard = () => {
  const [errors, setErrors] = useState([]);

  return (
    <Layout
      title="Add a ward"
      hasErrors={errors.length != 0}
      renderLogout={true}
    >
      <GridRow>
        <GridColumn width="two-thirds">
          <WardForm errors={errors} setErrors={setErrors} />
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyAdminToken(
    async () => {
      let props = {};
      return { props };
    },
    {
      tokens: new TokenProvider(process.env.JWT_SIGNING_KEY),
    }
  )
);

export default AddAWard;
