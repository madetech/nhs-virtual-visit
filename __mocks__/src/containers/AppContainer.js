import mockMssql from "src/gateways/MsSQL";
export default {
  getMsSqlConnPool: jest.fn(() => mockMssql.getConnectionPool()),
  getRetrieveDepartmentByUuidGateway: jest.fn(() => () => Promise.resolve({})),
};
