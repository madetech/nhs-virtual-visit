const retrieveOrganisationsGateway = async (db) => {
  const res = await db.request().query("SELECT * FROM dbo.[organisation]");
  const organisations = res.recordset;
  return organisations;
};

export default retrieveOrganisationsGateway;
