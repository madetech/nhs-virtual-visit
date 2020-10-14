const updateWardVisitTotalsDb = ({
  getDb,
  getUpdateWardVisitTotalsGateway,
}) => async ({ wardId, date }) => {
  try {
    const db = await getDb();
    await getUpdateWardVisitTotalsGateway()(db, wardId, date);
    return { success: true, error: undefined };
  } catch (error) {
    return { success: false, error };
  }
};

export default updateWardVisitTotalsDb;
