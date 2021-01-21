export default ({ getRetrieveVisitsGateway }) => async ({ wardId }) => {
  return await getRetrieveVisitsGateway()(wardId);
};
