const createOrganization = ({ getCreateOrganizationGateway, logger }) => async ({
  name,
  status,
}) => {
  logger.info(`Adding organization ${name} to list`, name);
  return await getCreateOrganizationGateway()(name, status);
};

export default createOrganization;
