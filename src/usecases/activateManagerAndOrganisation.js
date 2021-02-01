const activateManagerAndOrganisation = ({
  getActivateManagerAndOrganisationGateway,
}) => async ({ userId, organisationId }) => {
  if (!userId) {
    return {
      organisation: null,
      error: "userId is not defined",
    };
  }

  if (!organisationId) {
    return {
      organisation: null,
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
