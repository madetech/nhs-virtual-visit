const retrieveOrganisations = ({ getRetrieveOrganisationsGateway }) => async ({
  page,
  limit,
}) => {
  const {
    organisations,
    total,
    error,
  } = await getRetrieveOrganisationsGateway()({ page, limit });

  let organisationsArr = [];

  if (organisations) {
    organisationsArr = organisations.map((organisation) => ({
      id: organisation.id,
      name: organisation.name,
      status: organisation.status,
    }));
  }

  return {
    organisations: organisationsArr,
    total,
    error: error,
  };
};

export default retrieveOrganisations;
