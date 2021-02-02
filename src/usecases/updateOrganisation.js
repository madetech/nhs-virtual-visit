const updateOrganisation = ({ getUpdateOrganisationGateway }) => async ({
  organisationId,
  name,
}) => {
  if (!organisationId) {
    return {
      organisation: null,
      error: "An organisationId must be provided.",
    };
  }
  if (!name) {
    return {
      organisation: null,
      error: "A name must be provided.",
    };
  }

  const { organisation, error } = await getUpdateOrganisationGateway()({
    id: organisationId,
    name,
  });

  return {
    organisation,
    error: error,
  };
};

export default updateOrganisation;
