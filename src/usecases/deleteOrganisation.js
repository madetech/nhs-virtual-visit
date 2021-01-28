export default ({ getDeleteOrganisationGateway }) => async (organisationId) => {
  return getDeleteOrganisationGateway()(organisationId);
};
