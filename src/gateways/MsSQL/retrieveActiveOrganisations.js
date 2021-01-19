const retrieveOrganisationsGateway = async (db) => {
  const res = await db
    .request()
    .input("status", 1)
    .query("SELECT * FROM dbo.[organisation] WHERE STATUS = @status");
  const organisations = res.recordset;
  return organisations;
};

export default retrieveOrganisationsGateway;
