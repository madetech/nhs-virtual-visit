const createVisit = ({ getDb }) => async (visit) => {
  const db = getDb();

  console.log("Creating visit for ", visit);
  return await db.ScheduledCall.create({
    patientName: visit.patientName,
    contactNumber: visit.contactNumber,
    callTime: visit.callTime,
    callId: visit.callId,
  });
};

export default createVisit;
