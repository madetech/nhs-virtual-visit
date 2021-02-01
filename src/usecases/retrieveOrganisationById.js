const retrieveOrganisationById = ({
  getRetrieveOrganisationByIdGateway,
}) => async (organisationId) => {
  if (!organisationId) {
    return {
      organisation: null,
      error: "organisationId is not defined",
    };
  }

  const { organisation, error } = await getRetrieveOrganisationByIdGateway()(
    organisationId
  );

  let organisationObj;

  if (organisation) {
    organisationObj = {
      id: organisation.id,
      name: organisation.name,
      uuid: organisation.uuid,
    };
  }

  return {
    organisation: organisationObj,
    error: error,
  };
};

export default retrieveOrganisationById;
