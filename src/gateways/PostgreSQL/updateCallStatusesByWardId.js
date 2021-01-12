const updateCallStatusesByWardIdQuery = async (db, wardId, status) =>
  await db.any(
    `UPDATE scheduled_calls_table SET status = $1 WHERE ward_id = $2`,
    [status, wardId]
  );

const returnsNull = () => null;

export default ({ getDb }) => async (wardId, status) =>
  returnsNull(updateCallStatusesByWardIdQuery(await getDb(), wardId, status));
