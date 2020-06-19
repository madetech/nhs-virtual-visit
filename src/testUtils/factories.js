import AppContainer from "../containers/AppContainer";
const container = AppContainer.getInstance();

export const setupTrust = async ({
  name = null,
  adminCode = null,
  password = null,
} = {}) => {
  return await container.getCreateTrust()({
    name: name || "Test Trust",
    adminCode: adminCode || "TESTCODE",
    password: password || "TESTPASSWORD",
  });
};
