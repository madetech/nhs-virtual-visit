import React, { useState } from "react";
import Error from "next/error";
import { GridRow, GridColumn } from "../../src/components/Grid";
import Layout from "../../src/components/Layout";
import verifyAdminToken from "../../src/usecases/verifyAdminToken";
import TokenProvider from "../../src/providers/TokenProvider";
import propsWithContainer from "../../src/middleware/propsWithContainer";
import EditWardForm from "../../src/components/EditWardForm";

const EditAWard = ({ error, id, name, hospitalName }) => {
  if (error) {
    return <Error />;
  }

  const [errors, setErrors] = useState([]);

  return (
    <Layout
      title="Edit a ward"
      hasErrors={errors.length != 0}
      renderLogout={true}
    >
      <GridRow>
        <GridColumn width="two-thirds">
          <EditWardForm
            errors={errors}
            setErrors={setErrors}
            id={id}
            initialName={name}
            initialHospitalName={hospitalName}
          />
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyAdminToken(
    async ({ container, query }) => {
      const getWardById = container.getWardById();
      const { ward, error } = await getWardById(query.wardId);

      return {
        props: {
          error: error,
          id: ward.id,
          name: ward.name,
          hospitalName: ward.hospitalName,
        },
      };
    },
    {
      tokens: new TokenProvider(process.env.JWT_SIGNING_KEY),
    }
  )
);

export default EditAWard;
