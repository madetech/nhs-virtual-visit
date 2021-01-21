const retrieveOrganizations = ({ getRetrieveOrganizations }) => async () => {
  return await getRetrieveOrganizations()();
};

export default retrieveOrganizations;
