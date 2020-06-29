import AppContainer from "../containers/AppContainer";
const container = AppContainer.getInstance();

export const setupTrust = async (args = {}) => {
  return await container.getCreateTrust()({
    name: "Test Trust",
    adminCode: "TESTCODE",
    password: "TESTPASSWORD",
    videoProvider: "TESTPROVIDER",
    ...args,
  });
};

export const setupHospital = async (args = {}) => {
  return await container.getCreateHospital()({
    name: "Test Hospital",
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

export const setupWardWithinHospitalAndTrust = async ({ index = 1 }) => {
  const { trustId } = await setupTrust({ adminCode: `TESTCODE${index}` });
  const { hospitalId } = await setupHospital({ trustId });
  const { wardId } = await setupWard({
    code: `wardCode${index}`,
    trustId,
    hospitalId,
  });

  return { wardId, hospitalId, trustId };
};

export const setupVisit = async (args = {}) => {
  return await container.getCreateVisit()({
    patientName: "Patient Name",
    contactEmail: "contact@example.com",
    contactName: "Contact Name",
    callTime: new Date("2020-06-01 13:00"),
    callId: "TESTCALLID",
    provider: "TESTPROVIDER",
    callPassword: "TESTCALLPASSWORD",
    ...args,
  });
};
