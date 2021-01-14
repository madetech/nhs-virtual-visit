const updateManager = ({
  getMsSqlConnPool,
  getUpdateManagerStatusGateway,
}) => async ({ email, status }) => {
  try {
    const db = await getMsSqlConnPool();
    await getUpdateManagerStatusGateway()(db, email, status);
    return { error: null };
  } catch (error) {
    return { error: "There was an error update a manager." };
  }
};

export default updateManager;
