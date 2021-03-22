import mockMssql from "src/gateways/MsSQL";
import mockTokenProvider from "src/providers/TokenProvider";
import logger from "../../../logger"

export default {
  getMsSqlConnPool: jest.fn(() => mockMssql.getConnectionPool()),
  getTokenProvider: jest.fn(() => ({ ...mockTokenProvider })),
  getRegenerateToken: jest.fn(() => () => ({})),
  getRetrieveOrganisationById: jest.fn(() => () => Promise.resolve({})),
  getCreateFacilityGateway: jest.fn(() => () => Promise.resolve({})),
  getCreateFacility: jest.fn(() => () => Promise.resolve({})),
  getRetrieveFacilitiesByOrgId: jest.fn(() => () => Promise.resolve({})),
  getRetrieveFacilityByUuid: jest.fn(() => () => Promise.resolve({})),
  getRetrieveFacilityByIdGateway: jest.fn(() => () => Promise.resolve({})),
  getRetrieveFacilityByUuidGateway: jest.fn(() => () => Promise.resolve({})),
  getUpdateFacilityById: jest.fn(() => () => Promise.resolve({})),
  getUpdateFacilityByIdGateway: jest.fn(() => () => Promise.resolve({})),
  getUpdateVisitStatusByDepartmentIdGateway: jest.fn(() => () =>
    Promise.resolve({})
  ),
  getCreateDepartment: jest.fn(() => () => Promise.resolve({})),
  getCreateDepartmentGateway: jest.fn(() => () => Promise.resolve({})),
  getRetrieveDepartmentById: jest.fn(() => () => Promise.resolve({})),
  getRetrieveDepartmentByIdGateway: jest.fn(() => () => Promise.resolve({})),
  getRetrieveDepartmentByUuidGateway: jest.fn(() => () => Promise.resolve({})),
  getRetrieveDepartmentByUuid: jest.fn(() => () => Promise.resolve({})),
  getRetrieveActiveDepartmentsByFacilityId: jest.fn(() => () =>
    Promise.resolve({})
  ),
  getRetrieveActiveDepartmentsByFacilityIdGateway: jest.fn(() => () =>
    Promise.resolve({})
  ),
  getUpdateDepartmentById: jest.fn(() => () => Promise.resolve({})),
  getUpdateDepartmentByIdGateway: jest.fn(() => () => Promise.resolve({})),
  getArchiveDepartmentByIdGateway: jest.fn(() => () => Promise.resolve({})),
  getArchiveDepartmentById: jest.fn(() => () => Promise.resolve({})),
  getTrustAdminIsAuthenticated: jest.fn(() => () => true),
  getRetrieveEmailAndHashedPasswordGateway: jest.fn(() => () =>
    Promise.resolve({})
  ),
  getResetPasswordGateway: jest.fn(() => () => Promise.resolve({})),
  getRetrieveTotalBookedVisitsForFacilitiesByOrgIdGateway: jest.fn(() => () => Promise.resolve({})),
  getRetrieveTotalCompletedVisitsByOrgOrFacilityIdGateway: jest.fn(() => () => Promise.resolve({})),
  getRetrieveTotalVisitsByStatusAndFacilityIdGateway: jest.fn(() => () => Promise.resolve({})),
  getRetrieveTotalVisitsByStatusAndOrgIdGateway: jest.fn().mockResolvedValue({}),
  getRetrieveTotalBookedVisitsForDepartmentsByFacilityIdGateway: jest.fn().mockResolvedValue({}),
  getAdminIsAuthenticated: jest.fn(() => () => true),
  getOrganisationAdminIsAuthenticated: jest.fn(() => () => true),
  getDeleteRecipientInformationForPii: jest.fn(() => () => Promise.resolve({})),
  getUpdateScheduledCallStartTimeByCallUuidGateway: jest.fn(() => () => Promise.resolve({})),
  logger
};
