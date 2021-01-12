const retrieveHospitalById = ({ getRetrieveHospitalByIdGateway }) => async (
  hospitalId,
  trustId
) => {
  const { hospital, error } = await getRetrieveHospitalByIdGateway()({
    hospitalId,
    trustId,
  });

  return {
    hospital: hospital,
    error: error,
  };
};

export default retrieveHospitalById;
