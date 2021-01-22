const activateManagerAndOrganisation = ({
  getActivateManagerAndOrganisationGateway,
}) => async ({ userId, organisationId }) => {
  if (!userId) {
    return {
      user: null,
      error: "userId is not defined",
    };
  }

  if (!organisationId) {
    return {
      user: null,
      error: "organisationId is not defined",
    };
  }

  const {
    organisation,
    error,
  } = await getActivateManagerAndOrganisationGateway()({
    userId,
    organisationId,
    verified: true,
    status: 1,
  });

  return { organisation, error };
};

export default activateManagerAndOrganisation;
