import logger from "../../logger";

const createOrganization = ({ getCreateOrganizationGateway }) => async ({
  name,
  status,
}) => {
  logger.info(`Adding organization ${name} to list`, name);
  return await getCreateOrganizationGateway()(name, status);
};

export default createOrganization;
