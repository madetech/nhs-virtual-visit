import moment from "moment";

export default function filterUpcomingVisits(visits) {
  return visits.filter((visit) =>
    moment(visit.callTime).isAfter(moment().endOf("day"))
  );
}
