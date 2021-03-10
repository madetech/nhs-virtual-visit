import AppContainer from "../../src/containers/AppContainer";
const container = AppContainer.getInstance();
import { v4 as uuidv4 } from "uuid";

export const setUpUserToVerify = async (args = {}) => {
  return await container.getAddToUserVerificationTableGateway()({
    code: "uuidv4",
    hash: "hash",
    ...args,
  });
};
export const setUpManager = async (args = {}) => {
  return await container.getInsertManagerGateway()({
    email: "default@nhs.co.uk",
    password: "password",
    type: "manager",
    ...args,
  });
};

export const setUpAdmin = async (args = {}) => {
  return await container.getInsertManagerGateway()({
    email: "admin@nhs.co.uk",
    password: "password",
    type: "admin",
    organisationId: null,
    ...args,
  });
};

export const setupOrganization = async (args = {}) => {
  return await container.getCreateOrganisationGateway()({
    name: "Test Trust",
    status: 0,
    type: "trust",
    ...args,
  });
};

export const setUpFacility = async (args = {}) => {
  const uuid = await container.getCreateFacilityGateway()({
    name: "Test Facility One",
    code: "TF1",
    ...args,
  });
  const {
    id: facilityId,
    uuid: facilityUuid,
  } = await container.getRetrieveFacilityByUuidGateway()(uuid);
  return { facilityId, facilityUuid };
};

export const setUpDepartment = async (args = {}) => {
  const uuid = await container.getCreateDepartmentGateway()({
    name: "Test Department",
    code: "departmentCode",
    pin: "1234",
    ...args,
  });
  const {
    id: departmentId,
    uuid: departmentUuid,
  } = await container.getRetrieveDepartmentByUuidGateway()(uuid);
  return { departmentId, departmentUuid };

};
export const setupOrganisationAndManager = async (
  args = {
    organisationArgs: {},
    userArgs: {},
  }
) => {
  const {
    user: { id: userId },
  } = await setUpManager({
    ...args.userArgs,
  });

  const {
    organisation: { id: orgId },
  } = await setupOrganization({
    createdBy: userId,
    ...args.organisationArgs,
  });

  return { userId, orgId };
};

export const setupAdminAndOrganisation = async (
  args = {
    organisationArgs: {},
    userArgs: {},
  }
) => {
  const {
    user: { id: adminId },
  } = await setUpAdmin({
    ...args.userArgs,
  });

  const {
    organisation: { id: orgId },
  } = await setupOrganization({
    createdBy: adminId,
    ...args.organisationArgs,
  });

  return { adminId, orgId };
};

export const setupOrganisationAndFacility = async (
  args = {
    organisationArgs: {},
    facilityArgs: {},
  }
) => {
  const {
    organisation: { id: orgId },
  } = await setupOrganization({
    ...args.organisationArgs,
  });

  const { facilityId, facilityUuid } = await setUpFacility({
    orgId,
    createdBy: args.organisationArgs.createdBy,
    ...args.facilityArgs,
  });

  return { orgId, facilityId, facilityUuid };
};

export const setupOrganisationFacilityAndManager = async (
  args = {
    organisationArgs: {},
    facilityArgs: {},
    userArgs: {},
  }
) => {
  const { orgId, userId } = await setupOrganisationAndManager({
    userArgs: args.userArgs,
    organisationArgs: args.organisationArgs,
  });
  const { facilityId, facilityUuid } = await setUpFacility({
    orgId,
    createdBy: userId,
    ...args.facilityArgs,
  });

  return { userId, orgId, facilityId, facilityUuid };
};

export const setupOrganisationFacilityDepartmentAndManager = async (
  args = {
    organisationArgs: {},
    facilityArgs: {},
    userArgs: {},
    departmentArgs: {},
  }
) => {
  const {
    orgId,
    userId,
    facilityId,
    facilityUuid,
  } = await setupOrganisationFacilityAndManager({
    userArgs: args.userArgs,
    organisationArgs: args.organisationArgs,
    facilityArgs: args.facilityArgs,
  });

  const { departmentId, departmentUuid } = await setUpDepartment({
    facilityId,
    createdBy: userId,
    ...args.departmentArgs,
  });

  return {
    userId,
    orgId,
    facilityId,
    facilityUuid,
    departmentUuid,
    departmentId,
  };
};

export const setUpScheduledCall = async (args = {}) => {
  const visit = {
    patientName: "Patient Test",
    recipientEmail: "test1@testemail.com",
    recipientName: "Contact Test",
    recipientNumber: "07123456789",
    callTime: new Date(2021, 0, 27, 13, 37, 0, 0),
    callId: uuidv4(),
    ...args,
  };
  return await container.getCreateScheduledCallGateway()(
    visit,
    args.departmentId
  );
};
