import moment from "moment";

export default function filterPastVisits(visits) {
  return visits.filter((visit) =>
    moment(visit.callTime).isBefore(moment().startOf("day"))
  );
}
