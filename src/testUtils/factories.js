import AppContainer from "../containers/AppContainer";
import { insertVisit } from "../usecases/createVisit";
const container = AppContainer.getInstance();

export const setupTrust = async (args = {}) => {
  return await container.getCreateTrust()({
    name: "Test Trust",
    adminCode: "TESTCODE",
    password: "TESTPASSWORD",
    videoProvider: "whereby",
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

export const setupWard = async (args = {}) => {
  return await container.getCreateWard()({
    name: "Test Ward",
    code: "wardCode",
    ...args,
  });
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
    //we'll need to do something about this so we won't need to keep regularly bumping it up
    callTime: new Date("2020-11-01 13:00"),
    callId: "TESTCALLID",
    provider: "whereby",
    callPassword: "TESTCALLPASSWORD",
    ...args,
  };
  return await insertVisit(db, visit);
};
