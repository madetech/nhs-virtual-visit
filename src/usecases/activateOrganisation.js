const activateOrganisation = ({ getActivateOrganisationGateway }) => async ({
  organisationId,
}) => {
  if (!organisationId) {
    return {
      organisation: null,
      error: "organisationId is not defined",
    };
  }

  const { organisation, error } = await getActivateOrganisationGateway()({
    organisationId,
    status: 1,
  });

  return { organisation, error };
};

export default activateOrganisation;
