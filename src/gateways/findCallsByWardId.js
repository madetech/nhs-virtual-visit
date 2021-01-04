const recordToDomain = ({ ward_id, call_id, status }) => ({
  wardId: ward_id,
  callId: call_id,
  status,
});
const recordsToDomain = (records) => records.map(recordToDomain);

const findCallsByWardIdQuery = async (db, wardId) =>
  await db.any(
    `SELECT ward_id, call_id, status FROM scheduled_calls_table WHERE ward_id = $1`,
    wardId
  ); //add columns as needed

export default ({ getDb }) => async (wardId) =>
  recordsToDomain(await findCallsByWardIdQuery(await getDb(), wardId));
