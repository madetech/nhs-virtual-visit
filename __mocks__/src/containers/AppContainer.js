import mockMssql from "src/gateways/MsSQL";
import mockTokenProvider from "src/providers/TokenProvider";

export default {
  getMsSqlConnPool: jest.fn(() => mockMssql.getConnectionPool()),
  getTokenProvider: jest.fn(() => ({ ...mockTokenProvider })),
  getRegenerateToken: jest.fn(() => () => ({})),
  getRetrieveOrganisationById: jest.fn(() => () => Promise.resolve({})),
  getRetrieveFacilitiesByOrgId: jest.fn(() => () => Promise.resolve({})),
  getRetrieveFacilityByUuid: jest.fn(() => () => Promise.resolve({})),
  getCreateFacilityGateway: jest.fn(() => () => Promise.resolve({})),
  getRetrieveFacilityByIdGateway: jest.fn(() => () => Promise.resolve({})),
  getRetrieveFacilityByUuidGateway: jest.fn(() => () => Promise.resolve({})),
  getRetrieveDepartmentByUuidGateway: jest.fn(() => () => Promise.resolve({})),
  getRetrieveDepartmentByUuid: jest.fn(() => () => Promise.resolve({})),
  getRetrieveDepartmentsByFacilityIdGateway: jest.fn(() => () =>
    Promise.resolve({})
  ),
  getUpdateDepartmentById: jest.fn(() => () => Promise.resolve({})),
  getUpdateDepartmentByIdGateway: jest.fn(() => () => Promise.resolve({})),
  getUpdateFacilityByIdGateway: jest.fn(() => () => Promise.resolve({})),
  getTrustAdminIsAuthenticated: jest.fn(() => () => true),
};
