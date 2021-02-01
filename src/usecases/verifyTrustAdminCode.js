export default ({ getVerifyTrustAdminCodeGateway }) => async (
  trustAdminCode,
  password
) => {
  return await getVerifyTrustAdminCodeGateway()(trustAdminCode, password);
};
