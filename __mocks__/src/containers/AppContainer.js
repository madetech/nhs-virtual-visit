import mockMssql from "src/gateways/MsSQL";
export default {
  getMsSqlConnPool: jest.fn(() => mockMssql.getConnectionPool()),
  getTokenProvider: jest.fn({ type: null, trustId: null }),
  getRetrieveFacilityByIdGateway: jest.fn(() => () => Promise.resolve({})),
  getRetrieveFacilityByUuidGateway: jest.fn(() => () => Promise.resolve({})),
  getRetrieveDepartmentByUuidGateway: jest.fn(() => () => Promise.resolve({})),
  getRetrieveDepartmentByUuid: jest.fn(() => () => Promise.resolve({})),
  getUpdateDepartmentById: jest.fn(() => () => Promise.resolve({})),
  getUpdateDepartmentByIdGateway: jest.fn(() => () => Promise.resolve({})),
  getTrustAdminIsAuthenticated: jest.fn(() => () => true),
};
