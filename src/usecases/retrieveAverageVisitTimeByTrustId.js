import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
momentDurationFormatSetup(moment);

const retrieveAverageVisitTimeByTrustId = ({ getDb }) => async (trustId) => {
  if (!trustId) return { error: "A trustId must be provided." };

  const db = await getDb();

  const [
    { average_visit_duration_seconds: averageVisitTimeSeconds },
  ] = await db.any(
    `SELECT COALESCE(
      AVG(
        NULLIF(visit_duration_seconds, 0)
      )
    , 0) as average_visit_duration_seconds FROM
    (
      SELECT
        GREATEST(
          EXTRACT(
            EPOCH FROM MAX(leave_events.time) - MIN(join_events.time)
          ), 0
        ) AS visit_duration_seconds from events join_events
      LEFT JOIN events leave_events on join_events.visit_id = leave_events.visit_id
      LEFT JOIN scheduled_calls_table ON leave_events.visit_id = scheduled_calls_table.id
      LEFT JOIN wards ON scheduled_calls_table.ward_id = wards.id
      LEFT JOIN hospitals ON wards.hospital_id = hospitals.id
      LEFT JOIN trusts ON hospitals.trust_id = trusts.id
      WHERE trusts.id = $1
      AND join_events.action = 'join-visit'
      AND leave_events.action = 'leave-visit'
      GROUP BY join_events.visit_id
    ) visit_durations`,
    [trustId]
  );

  const averageVisitTime = moment
    .duration(parseFloat(averageVisitTimeSeconds), "seconds")
    .format("h [hr], m [min]");

  return {
    averageVisitTimeSeconds: parseFloat(averageVisitTimeSeconds),
    averageVisitTime,
    error: null,
  };
};

export default retrieveAverageVisitTimeByTrustId;
