const calculateTotalNumberOfVisits = (visitsByWard) =>
  visitsByWard.reduce((total, { visits }) => total + visits, 0);

const getVisitsByWard = async (db) => {
  const queryResult = await db.any(
    "SELECT wards.hospital_name, wards.name, SUM(totals.total) AS total_visits FROM ward_visit_totals AS totals JOIN wards ON wards.id = totals.ward_id GROUP BY wards.hospital_name, wards.name"
  );

  return queryResult.map(({ hospital_name, total_visits, name }) => ({
    hospitalName: hospital_name,
    name,
    visits: parseInt(total_visits),
  }));
};

export default ({ getDb }) => async () => {
  const db = await getDb();
  const visitTotals = await getVisitsByWard(db);
  const overallTotal = calculateTotalNumberOfVisits(visitTotals);

  return { total: overallTotal, byWard: visitTotals };
};
