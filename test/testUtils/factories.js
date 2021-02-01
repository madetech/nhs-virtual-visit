import AppContainer from "../../src/containers/AppContainer";
const container = AppContainer.getInstance();

export const setUpManager = async (args = {}) => {
  return await container.getInsertManagerGateway()({
    email: "default@nhs.co.uk",
    password: "password",
    type: "manager",
    ...args,
  });
};

export const setupTrust = async (args = {}) => {
  return await container.getCreateTrust()({
    name: "Test Trust",
    adminCode: "TESTCODE",
    password: "TESTPASSWORD",
    videoProvider: "whereby",
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

export const setupHospital = async (args = {}) => {
  return await container.getCreateHospital()({
    name: "Test Hospital",
    supportUrl: "https://www.support.example.com",
    surveyUrl: "https://www.survey.example.com",
    ...args,
  });
};

export const setUpFacility = async (args = {}) => {
  return await container.getCreateFacilityGateway()({
    name: "Test Facility One",
    code: "TF1",
    ...args,
  });
};

export const setupWard = async (args = {}) => {
  return await container.getCreateWard()({
    name: "Test Ward",
    code: "wardCode",
    ...args,
  });
};

export const setUpDepartment = async (args = {}) => {
  return await container.getCreateDepartmentGateway()({
    name: "Test Department",
    code: "departmentCode",
    pin: "1234",
    ...args,
  });
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

  const uuid = await setUpFacility({
    orgId,
    createdBy: args.organisationArgs.createdBy,
    ...args.facilityArgs,
  });

  const {
    id: facilityId,
    uuid: facilityUuid,
  } = await container.getRetrieveFacilityByUuidGateway()(uuid);

  return { orgId, facilityId, facilityUuid };
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

  const uuid = await setUpFacility({
    orgId,
    createdBy: args.organisationArgs.createdBy,
    ...args.facilityArgs,
  });

  const {
    id: facilityId,
    uuid: facilityUuid,
  } = await container.getRetrieveFacilityByUuidGateway()(uuid);

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
  const uuid = await setUpFacility({
    orgId,
    createdBy: userId,
    ...args.facilityArgs,
  });

  const {
    id: facilityId,
    uuid: facilityUuid,
  } = await container.getRetrieveFacilityByUuidGateway()(uuid);

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

  const uuid = await setUpDepartment({
    facilityId,
    createdBy: userId,
    ...args.departmentArgs,
  });
  const {
    id: departmentId,
    uuid: departmentUuid,
  } = await container.getRetrieveDepartmentByUuidGateway()(uuid);

  return {
    userId,
    orgId,
    facilityId,
    facilityUuid,
    departmentUuid,
    departmentId,
  };
};

export const setupWardWithinHospitalAndTrust = async (
  args = {
    index: 1,
    trustArgs: {},
    hospitalArgs: {},
    wardArgs: {},
  }
) => {
  const { trustId } = await setupTrust({
    adminCode: `TESTCODE${args.index}`,
    ...args.trustArgs,
  });
  const { hospitalId } = await setupHospital({ trustId, ...args.hospitalArgs });
  const { wardId } = await setupWard({
    code: `wardCode${args.index}`,
    trustId,
    hospitalId,
    ...args.wardArgs,
  });

  return { wardId, hospitalId, trustId };
};

export const setupVisit = async (args = {}) => {
  const db = await container.getDb();
  const visit = {
    patientName: "Patient Name",
    contactEmail: "contact@example.com",
    contactName: "Contact Name",
    callTime: new Date("2020-06-01 13:00"),
    callId: "TESTCALLID",
    provider: "whereby",
    callPassword: "TESTCALLPASSWORD",
    ...args,
  };
  return await container.getInsertVisitGateway()(db, visit, args.wardId);
};
