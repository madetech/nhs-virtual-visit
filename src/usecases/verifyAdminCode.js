export default ({ getVerifyAdminCodeGateway }) => async (email, password) => {
  return await getVerifyAdminCodeGateway()(email, password);
};