const retrieveOrganisationById = ({
  getRetrieveOrganisationByIdGateway,
}) => async (organisationId) => {
  const { organisation, error } = await getRetrieveOrganisationByIdGateway()(
    organisationId
  );

  let organisationObj;

  if (organisation) {
    organisationObj = { name: organisation.name };
  }

  return {
    organisation: organisationObj,
    error: error,
  };
};

export default retrieveOrganisationById;
