const retrieveOrganisations = ({ getRetrieveOrganisationsGateway }) => async ({
  page,
  limit,
}) => {
  const {
    organisations,
    total,
    error,
  } = await getRetrieveOrganisationsGateway()({ page, limit });

  let organisationsObj = [];

  if (organisations) {
    organisationsObj = organisations.map((organisation) => ({
      id: organisation.id,
      name: organisation.name,
      status: organisation.status,
    }));
  }

  return {
    organisations: organisationsObj,
    total,
    error: error,
  };
};

export default retrieveOrganisations;
