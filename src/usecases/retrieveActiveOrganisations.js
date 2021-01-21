const retrieveActiveOrganisations = ({
  getRetrieveActiveOrganisationsGateway,
}) => async () => {
  const {
    organisations,
    error,
  } = await getRetrieveActiveOrganisationsGateway()();

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
    error: error,
  };
};

export default retrieveActiveOrganisations;
