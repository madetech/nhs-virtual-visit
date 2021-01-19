const retrieveWardsByHospitalId = ({
  getRetrieveWardsByHospitalIdGateway,
}) => async (hospitalId) => {
  return await getRetrieveWardsByHospitalIdGateway()(hospitalId);
};

export default retrieveWardsByHospitalId;
