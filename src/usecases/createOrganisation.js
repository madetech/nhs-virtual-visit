const createOrganisation = ({ getCreateOrganisationGateway }) => async ({
  name,
  type,
  createdBy,
}) => {
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
