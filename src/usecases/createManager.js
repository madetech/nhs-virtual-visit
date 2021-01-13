const createManager = ({
  getMsSqlConnPool,
  getInsertManagerGateway,
}) => async ({ email, password, organisationId, type }) => {
  try {
    const db = await getMsSqlConnPool();
    await getInsertManagerGateway()(db, email, password, organisationId, type);
    return { error: null };
  } catch (error) {
    return { error: "There was an error creating a manager." };
  }
};

export default createManager;
