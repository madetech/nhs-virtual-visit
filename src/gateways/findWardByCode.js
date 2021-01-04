const recordToDomain = ({ id, code, trust_id }) => ({
  wardId: id,
  wardCode: code,
  trustId: trust_id,
});
const findWardQuery = async (db, wardCode) =>
  await db.any(`SELECT id, code, trust_id FROM wards WHERE code = $1 LIMIT 1`, [
    wardCode,
  ]);
const applyIfDefined = async (value, func) =>
  value !== undefined ? await func(value) : null;

export default ({ getDb }) => async (wardCode) =>
  applyIfDefined(
    (await findWardQuery(await getDb(), wardCode))[0],
    async (record) => recordToDomain(record)
  );
