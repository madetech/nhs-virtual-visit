const updateOrganisation = ({ getUpdateOrganisationStatusGateway }) => async ({
  organisationId,
  status,
}) => {
  try {
    await getUpdateOrganisationStatusGateway()(organisationId, status);
    return { error: null };
  } catch (error) {
    return { error: "There was an error updating an organisation." };
  }
};

export default updateOrganisation;
