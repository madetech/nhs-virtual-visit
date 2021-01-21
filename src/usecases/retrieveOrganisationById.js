export default ({ getRetrieveOrganisationByIdGateway }) => async (
  organisationId
) => {
  if (organisationId === undefined) {
    return { name: undefined, uuid: undefined, error: "id must be provided." };
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
