const updateOrganisationStatusGateway = async (db, organisationId, status) => {
  await db
    .request()
    .input("organisationId", organisationId)
    .input("status", status)
    .query(
      `UPDATE dbo.[organisation] SET status = @statu WHERE id = @organisationId`
    );
};

export default updateOrganisationStatusGateway;
