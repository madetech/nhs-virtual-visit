import moment from "moment";

const recordToDomain = ({ id, code, trust_id, archived_at }) => ({
  wardId: id,
  wardCode: code,
  trustId: trust_id,
  archivedAt: archived_at && moment(archived_at).toISOString(),
});
const findWardQuery = async (db, wardCode) =>
  await db.any(
    `SELECT id, code, trust_id, archived_at FROM wards WHERE code = $1 LIMIT 1`,
    [wardCode]
  );
const applyIfDefined = async (value, func) =>
  value !== undefined ? await func(value) : null;

export default ({ getDb }) => async (wardCode) =>
  applyIfDefined(
    (await findWardQuery(await getDb(), wardCode))[0],
    async (record) => recordToDomain(record)
  );
