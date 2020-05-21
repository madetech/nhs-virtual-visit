import moment from "moment";

export default function filterPastVisits(visits) {
  return visits.filter((visit) =>
    moment(visit.callTime).isBetween(
      moment().subtract(12, "hours").subtract(1, "seconds"),
      moment().subtract(1, "hours").add(1, "seconds")
    )
  );
}
