export default ({ getUpdateHospitalGateway }) => async ({
  name,
  id,
  status,
  supportUrl = null,
  surveyUrl = null,
}) => {
  const { hospitalId, error } = await getUpdateHospitalGateway()({
    name,
    id,
    supportUrl,
    surveyUrl,
    status,
  });

  return {
    id: hospitalId,
    error: error,
  };
};
