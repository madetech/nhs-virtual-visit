import moment from "moment";

export default function filterTodaysVisits(visits) {
  return visits.filter((visit) =>
    moment(visit.callTime).isBetween(
      moment().startOf("day"),
      moment().endOf("day")
    )
  );
}
