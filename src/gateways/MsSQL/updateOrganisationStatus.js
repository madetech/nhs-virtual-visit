const updateOrganisationStatusGateway = ({ getMsSqlConnPool }) => async (
  organisationId,
  status
) => {
  const db = await getMsSqlConnPool();
  await db
    .request()
    .input("organisationId", organisationId)
    .input("status", status)
    .query(
      `UPDATE dbo.[organisation] SET status = @status WHERE id = @organisationId`
    );
};

export default updateOrganisationStatusGateway;
