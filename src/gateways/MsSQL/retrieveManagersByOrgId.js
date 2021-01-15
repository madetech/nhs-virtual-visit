const retrieveManagersByOrgIdGateway = async (db, orgId) => {
  const res = await db
    .request()
    .input("orgId", orgId)
    .query(
      "SELECT email, uuid, status FROM dbo.[user] WHERE organisation_id = @orgId"
    );
  return res.recordset;
};

export default retrieveManagersByOrgIdGateway;
