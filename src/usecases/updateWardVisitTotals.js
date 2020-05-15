export default ({ getDb, getSendVisitsMilestoneNotification }) => async ({
  wardId,
  date,
}) => {
  try {
    const db = await getDb();
    const res = await db.any(
      "SELECT id, ward_id, total FROM ward_visit_totals WHERE ward_id = $1 AND total_date = $2",
      [wardId, date]
    );

    const [existingTotal] = res;

    if (existingTotal) {
      const newTotal = existingTotal.total + 1;
      await db.none("UPDATE ward_visit_totals SET total = $2 WHERE id = $1", [
        existingTotal.id,
        newTotal,
      ]);

      const sendVisitsMilestoneNotification = getSendVisitsMilestoneNotification();

      await sendVisitsMilestoneNotification({ numberOfVisits: newTotal });
    } else {
      await db.one(
        "INSERT INTO ward_visit_totals (ward_id, total_date, total) VALUES ($1, $2, $3) RETURNING id",
        [wardId, date, 1]
      );
    }

    return { success: true, error: undefined };
  } catch (error) {
    return { success: false, error };
  }
};
