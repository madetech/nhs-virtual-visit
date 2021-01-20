export default ({ getRetrieveVisitsGateway }) => async ({ wardId }) => {
  return getRetrieveVisitsGateway()(wardId);
};