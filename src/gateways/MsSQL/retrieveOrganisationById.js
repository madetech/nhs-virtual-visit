const retrieveOrganisationByIdGateway = ({ getMsSqlConnPool }) => async (
  organisationId
) => {
  const db = await getMsSqlConnPool();
  const res = await db
    .request()
    .input("organisationId", organisationId)
    .query("SELECT * FROM dbo.[organisation] WHERE id = @organisationId");
  const organisation = res.recordset[0];
  return organisation;
};

export default retrieveOrganisationByIdGateway;
