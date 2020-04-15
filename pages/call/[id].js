import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../src/components/Layout';

const Call = () => {
  const { query: { id } } = useRouter();

  return (
    <Layout>
      Call Id: {id}
    </Layout>
  );
};

export default Call;
