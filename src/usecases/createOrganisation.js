const createOrganisation = ({ getCreateOrganisationGateway }) => async ({
  name,
  type,
  createdBy,
}) => {
  if (!name) {
    return {
      organisationId: null,
      error: "name is not defined",
    };
  }

  if (!type) {
    return {
      organisationId: null,
      error: "type is not defined",
    };
  }

  const { organisation, error } = await getCreateOrganisationGateway()({
    name,
    type,
    createdBy,
  });

  let organisationId;

  if (organisation) {
    organisationId = organisation.id;
  }

  return {
    organisationId,
    error: error,
  };
};

export default createOrganisation;
