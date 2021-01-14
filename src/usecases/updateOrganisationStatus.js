const updateOrganisation = ({
  getMsSqlConnPool,
  getUpdateOrganisationStatusGateway,
}) => async ({ organisationId, status }) => {
  try {
    const db = await getMsSqlConnPool();
    console.log(organisationId);
    await getUpdateOrganisationStatusGateway()(db, organisationId, status);
    return { error: null };
  } catch (error) {
    return { error: "There was an error updating an organisation." };
  }
};

export default updateOrganisation;
