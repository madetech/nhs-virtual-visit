export const updateWardVisitTotalsDb = ({ getDb }) => async ({
  wardId,
  date,
}) => {
  try {
    const db = await getDb();
    await updateWardVisitTotalsSql(db, wardId, date);
    return { success: true, error: undefined };
  } catch (error) {
    return { success: false, error };
  }
};

export const updateWardVisitTotalsSql = async (db, wardId, date) => {
  const res = await db.any(
    "SELECT id, ward_id, total FROM ward_visit_totals WHERE ward_id = $1 AND total_date = $2",
    [wardId, date]
  );

  const [existingTotal] = res;

  if (existingTotal) {
    await db.none("UPDATE ward_visit_totals SET total = $2 WHERE id = $1", [
      existingTotal.id,
      existingTotal.total + 1,
    ]);
  } else {
    await db.one(
      "INSERT INTO ward_visit_totals (ward_id, total_date, total) VALUES ($1, $2, $3) RETURNING id",
      [wardId, date, 1]
    );
  }
};

export default { updateWardVisitTotalsDb, updateWardVisitTotalsSql };
