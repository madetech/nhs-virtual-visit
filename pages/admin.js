import Layout from "../src/components/Layout";
import verifyAdminToken from "../src/usecases/verifyAdminToken";
import TokenProvider from "../src/providers/TokenProvider";
import propsWithContainer from "../src/middleware/propsWithContainer";

const Admin = () => {
  return <Layout renderLogout={true}>Hi Admin</Layout>;
};

export const getServerSideProps = propsWithContainer(
  verifyAdminToken(
    async ({ authenticationToken, container }) => {
      return {
        props: {},
      };
    },
    {
      tokens: new TokenProvider(process.env.JWT_SIGNING_KEY),
    }
  )
);

export default Admin;
