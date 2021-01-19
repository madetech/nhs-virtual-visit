export default ({
  getRetrieveOrganisationByIdGateway,
}) => async (organisationId) => {
  if (organisationId === undefined) {
    return { uuid: undefined, error: "id is must be provided." };
  }
  const { organisation, error } = await getRetrieveOrganisationByIdGateway()(
    organisationId
  );

  let organisationObj;

  if (organisation) {
    organisationObj = { name: organisation.name, uuid: organisation.uuid };
  }

  return {
    organisation: organisationObj,
    error: error,
  };
};
