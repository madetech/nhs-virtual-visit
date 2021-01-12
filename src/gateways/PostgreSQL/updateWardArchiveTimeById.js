const updateWardArchiveTimeByIdQuery = async (db, wardId, time) =>
  await db.result(`UPDATE wards SET archived_at = $1 WHERE id = $2`, [
    time,
    wardId,
  ]);

const returnsNull = () => null;

export default ({ getDb }) => async (wardId, time) =>
  returnsNull(
    await updateWardArchiveTimeByIdQuery(await getDb(), wardId, time)
  );
