const retrieveHospitalsByTrustId = ({
  getRetrieveHospitalsByTrustIdGateway,
}) => async (trustId, options = { withWards: false }) => {
  const { hospitals, error } = await getRetrieveHospitalsByTrustIdGateway()({
    trustId,
    options,
  });

  return {
    hospitals: hospitals,
    error: error,
  };
};

export default retrieveHospitalsByTrustId;
