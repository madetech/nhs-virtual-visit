import Database from "../gateways/Database";
import GovNotify from "../gateways/GovNotify";
import logEvent from "../gateways/logEvent";
import CallIdProvider from "../providers/CallIdProvider";
import RandomIdProvider from "../providers/RandomIdProvider";

/* Usecases  */
import deleteVisitByCallId from "../usecases/deleteVisitByCallId";
import createWard from "../usecases/createWard";
import sendTextMessage from "../usecases/sendTextMessage";
import sendEmail from "../usecases/sendEmail";
import userIsAuthenticated from "../usecases/userIsAuthenticated";
import trustAdminIsAuthenticated from "../usecases/trustAdminIsAuthenticated";
import adminIsAuthenticated from "../usecases/adminIsAuthenticated";
import TokenProvider from "../providers/TokenProvider";
import verifyWardCode from "../usecases/verifyWardCode";
import verifyTrustAdminCode from "../usecases/verifyTrustAdminCode";
import verifyAdminCode from "../usecases/verifyAdminCode";
import retrieveVisits from "../usecases/retrieveVisits";
import retrieveVisitByCallId from "../usecases/retrieveVisitByCallId";
import verifyCallPassword from "../usecases/verifyCallPassword";
import retrieveWards from "../usecases/retrieveWards";
import updateWardVisitTotalsDb from "../usecases/updateWardVisitTotals";
import retrieveWardVisitTotals from "../usecases/retrieveWardVisitTotals";
import updateWard from "../usecases/updateWard";
import createHospital from "../usecases/createHospital";
import updateHospital from "../usecases/updateHospital";
import retrieveHospitalsByTrustId from "../usecases/retrieveHospitalsByTrustId";
import retrieveHospitalById from "../usecases/retrieveHospitalById";
import archiveWard from "../usecases/archiveWard";
import validateEmailAddress from "../usecases/validateEmailAddress";
import validateMobileNumber from "../usecases/validateMobileNumber";
import createTrust from "../usecases/createTrust";
import retrieveTrusts from "../usecases/retrieveTrusts";
import regenerateToken from "../usecases/regenerateToken";
import retrieveWardsByHospitalId from "../usecases/retrieveWardsByHospitalId";
import retrieveHospitalVisitTotals from "../usecases/retrieveHospitalVisitTotals";
import retrieveHospitalWardVisitTotals from "../usecases/retrieveHospitalWardVisitTotals";
import captureEvent from "../usecases/captureEvent";
import retrieveAverageParticipantsInVisit from "../usecases/retrieveAverageParticipantsInVisit";
import retrieveAverageVisitTimeByTrustId from "../usecases/retrieveAverageVisitTimeByTrustId";
import retrieveWardVisitTotalsStartDateByTrustId from "../usecases/retrieveWardVisitTotalsStartDateByTrustId";
import retrieveAverageVisitsPerDayByTrustId from "../usecases/retrieveAverageVisitsPerDayByTrustId";
import retrieveReportingStartDateByTrustId from "../usecases/retrieveReportingStartDateByTrustId";
import updateVisitById from "../usecases/updateVisitById";
import sendBookingNotification from "../usecases/sendBookingNotification";
import retrieveVisitById from "../usecases/retrieveVisitById";
import markVisitAsComplete from "../usecases/markVisitAsComplete";
import updateOrganisation from "../usecases/updateOrganisation";
import createOrganisation from "../usecases/createOrganisation";
import retrieveOrganisations from "../usecases/retrieveOrganisations";
import retrieveManagersByOrgId from "../usecases/retrieveManagersByOrgId";
import retrieveManagerByUuid from "../usecases/retrieveManagerByUuid";
import archiveManagerByUuid from "../usecases/archiveManagerByUuid";
import updateManagerStatusByUuid from "../usecases/updateManagerStatusByUuid";
import retrieveOrganisationById from "../usecases/retrieveOrganisationById";
import retrieveActiveOrganisations from "../usecases/retrieveActiveOrganisations";
import deleteOrganisation from "../usecases/deleteOrganisation";
import updateLinkStatusByHash from "../usecases/updateLinkStatusByHash";
import retrieveManagerByEmail from "../usecases/retrieveManagerByEmail";
import retrieveFacilitiesByOrgId from "../usecases/retrieveFacilitiesByOrgId";
import createFacility from "../usecases/createFacility";
import retrieveFacilityById from "../usecases/retrieveFacilityById";
import retrieveFacilityByUuid from "../usecases/retrieveFacilityByUuid";
import updateFacilityById from "../usecases/updateFacilityById";
import retrieveActiveDepartmentsByFacilityId from "../usecases/retrieveActiveDepartmentsByFacilityId";
import createDepartment from "../usecases/createDepartment";
import retrieveDepartmentByUuid from "../usecases/retrieveDepartmentByUuid";
import updateDepartmentById from "../usecases/updateDepartmentById";
import archiveDepartmentById from "../usecases/archiveDepartmentById";
import createManager from "../usecases/createManager";
/* GW MSSQL*/
import MsSQL from "../gateways/MsSQL";
import verifyUserLogin from "../gateways/MsSQL/verifyUserLogin";
import retrieveEmailAndHashedPassword from "../gateways/MsSQL/retrieveEmailAndHashedPassword";
import resetPassword from "../gateways/MsSQL/resetPassword";
import verifyResetPasswordLink from "../gateways/MsSQL/verifyResetPasswordLink";
import updateManagerStatusByUuidGateway from "../gateways/MsSQL/updateManagerStatusByUuid";
import retrieveManagersByOrgIdGateway from "../gateways/MsSQL/retrieveManagersByOrgId";
import retrieveManagerByUuidGateway from "../gateways/MsSQL/retrieveManagerByUuid";
import archiveManagerByUuidGateway from "../gateways/MsSQL/archiveManagerByUuid";
import retrieveOrganisationByIdGateway from "../gateways/MsSQL/retrieveOrganisationById";
import createOrganisationGateway from "../gateways/MsSQL/createOrganisation";
import retrieveActiveOrganisationsGateway from "../gateways/MsSQL/retrieveActiveOrganisations";
import retrieveOrganisationsGateway from "../gateways/MsSQL/retrieveOrganisations";
import deleteOrganisationGateway from "../gateways/MsSQL/deleteOrganisation";
import insertManagerGateway from "../gateways/MsSQL/insertManager";
import verifySignUpLinkGateway from "../gateways/MsSQL/verifySignUpLink";
import updateLinkStatusByHashGateway from "../gateways/MsSQL/updateLinkStatusByHash";
import retrieveManagerByEmailGateway from "../gateways/MsSQL/retrieveManagerByEmail";
import retrieveFacilitiesByOrgIdGW from "../gateways/MsSQL/retrieveFacilitiesByOrgId";
import createFacilityGateway from "../gateways/MsSQL/createFacility";
import retrieveFacilityByIdGateway from "../gateways/MsSQL/retrieveFacilityById";
import retrieveFacilityByUuidGateway from "../gateways/MsSQL/retrieveFacilityByUuid";
import updateFacilityByIdGateway from "../gateways/MsSQL/updateFacilityById";
import retrieveActiveDepartmentsByFacilityIdGateway from "../gateways/MsSQL/retrieveActiveDepartmentsByFacilityId";
import createDepartmentGateway from "../gateways/MsSQL/createDepartment";
import retrieveDepartmentByUuidGateway from "../gateways/MsSQL/retrieveDepartmentByUuid";
import updateDepartmentByIdGateway from "../gateways/MsSQL/updateDepartmentById";
import archiveDepartmentByIdGateway from "../gateways/MsSQL/archiveDepartmentById";
import retrieveDepartmentByCodeGateway from "../gateways/MsSQL/retrieveDepartmentByCode";
import verifyAdminCodeGateway from "../gateways/MsSQL/verifyAdminCode";
import retrieveActiveDepartmentsByOrganisationIdGateway from "../gateways/MsSQL/retrieveActiveDepartmentsByOrganisationId";
import updateDepartmentStatusByIdGateway from "../gateways/MsSQL/updateDepartmentStatusById";
import updateOrganisationGateway from "../gateways/MsSQL/updateOrganisation";
<<<<<<< HEAD
import insertScheduledCallGateway from "../gateways/MsSQL/insertVisit";
=======
import deleteVisitByCallIdGateway from "../gateways/MsSQL/deleteVisitByCallId";
>>>>>>> create deleteVisitByCallId  mssql gateway and update usecase unit test

/* GW Imports */
import findWardByCode from "../gateways/PostgreSQL/findWardByCode";
import insertVisit from "../gateways/PostgreSQL/insertVisit";
import updateCallStatusesByWardId from "../gateways/PostgreSQL/updateCallStatusesByWardId";
import updateWardArchiveTimeById from "../gateways/PostgreSQL/updateWardArchiveTimeById";
import updateWardVisitTotals from "../gateways/PostgreSQL/updateWardVisitTotals";
import retrieveWardById from "../gateways/PostgreSQL/retrieveWardById";
import retrieveTrustById from "../gateways/PostgreSQL/retrieveTrustById";
import retrieveOrganizationById from "../gateways/PostgreSQL/retrieveOrganizationById";
import retrieveOrganizationsGW from "../gateways/PostgreSQL/retrieveOrganizations";
import retrieveVisitByIdGW from "../gateways/PostgreSQL/retrieveVisitById";
import retrieveActiveWardsByTrustIdGW from "../gateways/PostgreSQL/retrieveActiveWardsByTrustId";
import captureEventGW from "../gateways/PostgreSQL/captureEvent";
import retrieveReportingStartDateByTrustIdGW from "../gateways/PostgreSQL/retrieveReportingStartDateByTrustId";
import retrieveAverageParticipantsInVisitGW from "../gateways/PostgreSQL/retrieveAverageParticipantsInVisit";
import retrieveHospitalVisitTotalsGW from "../gateways/PostgreSQL/retrieveHospitalVisitTotals";
import retrieveWardsByHospitalIdGW from "../gateways/PostgreSQL/retrieveWardsByHospitalId";
import markVisitAsCompleteGW from "../gateways/PostgreSQL/markVisitAsComplete";
import createTrustGW from "../gateways/PostgreSQL/createTrust";
import createWardGW from "../gateways/PostgreSQL/createWard";
import updateTrustGW from "../gateways/PostgreSQL/updateTrust";
import updateWardGW from "../gateways/PostgreSQL/updateWard";
import updateHospitalGW from "../gateways/PostgreSQL/updateHospital";
import retrieveHospitalByIdGW from "../gateways/PostgreSQL/retrieveHospitalById";
import retrieveHospitalsByTrustIdGW from "../gateways/PostgreSQL/retrieveHospitalsByTrustId";
import insertHospitalGW from "../gateways/PostgreSQL/insertHospital";
import deleteVisitByCallIdGW from "../gateways/PostgreSQL/deleteVisitByCallId";
import createOrganisationGW from "../gateways/PostgreSQL/createOrganization";
import retrieveWardVisitTotalsGateway from "../gateways/PostgreSQL/retrieveWardVisitTotals";
import retrieveHospitalWardVisitTotalsGateway from "../gateways/PostgreSQL/retrieveHospitalWardVisitTotals";
import retrieveAverageVisitTimeByTrustIdGateway from "../gateways/PostgreSQL/retrieveAverageVisitTimeByTrustId";
import retrieveAverageVisitsPerDayGateway from "../gateways/PostgreSQL/retrieveAverageVisitsPerDayByTrustId";
import retrieveTrustsGateway from "../gateways/PostgreSQL/retrieveTrusts";
import retrieveVisitByCallIdGateway from "../gateways/PostgreSQL/retrieveVisitByCallId";
import retrieveVisitsGateway from "../gateways/PostgreSQL/retrieveVisits";
import retrieveWardVisitTotalsStartDateByTrustIdGateway from "../gateways/PostgreSQL/retrieveWardVisitTotalsStartDateByTrustId";
import updateVisitByIdGateway from "../gateways/PostgreSQL/updateVisitById";
import verifyAdminCodeGW from "../gateways/PostgreSQL/verifyAdminCode";
import verifyTrustAdminCodeGateway from "../gateways/PostgreSQL/verifyTrustAdminCode";
import verifySignUpLink from "../usecases/verifySignUpLink";
import activateManagerAndOrganisation from "../usecases/activateManagerAndOrganisation";
import activateManagerAndOrganisationGateway from "../gateways/MsSQL/activateManagerAndOrganisation";
import activateOrganisation from "../usecases/activateOrganisation";
import activateOrganisationGateway from "../gateways/MsSQL/activateOrganisation";
import addToUserVerificationTable from "../usecases/addToUserVerificationTable";
import addToUserVerificationTableGateway from "../gateways/MsSQL/addToUserVerificationTable";
import updateVisitStatusByDepartmentId from "../gateways/MsSQL/updateVisitStatusByDepartmentId";

class AppContainer {
  getDb = () => {
    return Database.getInstance();
  };

  getMsSqlConnPool = () => {
    return MsSQL.getConnectionPool();
  };

  getNotifyClient = () => {
    return GovNotify.getInstance();
  };

  getCallIdProvider = () => async (trust, callTime) => {
    const provider = new CallIdProvider(trust.videoProvider, callTime);
    return await provider.generate();
  };

  getRandomIdProvider = () => new RandomIdProvider();

  getDeleteVisitByCallId = () => {
    return deleteVisitByCallId(this);
  };

  getCreateWard = () => {
    return createWard(this);
  };

  getRetrieveWardById = () => {
    return retrieveWardById;
  };

  getTokenProvider = () => {
    return new TokenProvider(process.env.JWT_SIGNING_KEY);
  };

  getUserIsAuthenticated = () => {
    return userIsAuthenticated(this);
  };

  getTrustAdminIsAuthenticated = () => {
    return trustAdminIsAuthenticated(this);
  };

  getAdminIsAuthenticated = () => {
    return adminIsAuthenticated(this);
  };

  getSendTextMessage = () => {
    return sendTextMessage(this);
  };

  getSendEmail = () => {
    return sendEmail(this);
  };

  getVerifyWardCode = () => {
    return verifyWardCode(this);
  };

  getVerifyTrustAdminCode = () => {
    return verifyTrustAdminCode(this);
  };

  getVerifyAdminCode = () => {
    return verifyAdminCode(this);
  };

  getRetrieveVisits = () => {
    return retrieveVisits(this);
  };

  getRetrieveVisitByCallId = () => {
    return retrieveVisitByCallId(this);
  };

  getVerifyCallPassword = () => {
    return verifyCallPassword(this);
  };

  getRetrieveWards = () => {
    return retrieveWards(this);
  };

  getUpdateWardVisitTotals = () => {
    return updateWardVisitTotalsDb(this);
  };

  getRetrieveWardVisitTotals = () => {
    return retrieveWardVisitTotals(this);
  };

  getUpdateWard = () => {
    return updateWard(this);
  };

  getCreateHospital = () => {
    return createHospital(this);
  };

  getCreateFacility = () => {
    return createFacility(this);
  };

  getUpdateHospital = () => {
    return updateHospital(this);
  };

  getRetrieveHospitalsByTrustId = () => {
    return retrieveHospitalsByTrustId(this);
  };

  getRetrieveFacilitiesByOrgId = () => {
    return retrieveFacilitiesByOrgId(this);
  };

  getRetrieveTrustById = () => {
    return retrieveTrustById;
  };

  getRetrieveHospitalById = () => {
    return retrieveHospitalById(this);
  };

  getArchiveWard = () => {
    return archiveWard(this);
  };

  getValidateEmailAddress = () => {
    return validateEmailAddress(this);
  };

  getValidateMobileNumber = () => {
    return validateMobileNumber(this);
  };

  getCreateTrust = () => {
    return createTrust(this);
  };

  getRetrieveTrusts = () => {
    return retrieveTrusts(this);
  };

  getRegenerateToken = () => {
    return regenerateToken(this);
  };

  getRetrieveWardsByHospitalId = () => {
    return retrieveWardsByHospitalId(this);
  };

  getRetrieveHospitalVisitTotals = () => {
    return retrieveHospitalVisitTotals(this);
  };

  getRetrieveHospitalWardVisitTotals = () => {
    return retrieveHospitalWardVisitTotals(this);
  };

  getCaptureEvent = () => {
    return captureEvent(this);
  };

  getRetrieveAverageParticipantsInVisit = () => {
    return retrieveAverageParticipantsInVisit(this);
  };

  getRetrieveAverageVisitTimeByTrustId = () => {
    return retrieveAverageVisitTimeByTrustId(this);
  };

  getRetrieveWardVisitTotalsStartDateByTrustId = () => {
    return retrieveWardVisitTotalsStartDateByTrustId(this);
  };

  getRetrieveAverageVisitsPerDayByTrustId = () => {
    return retrieveAverageVisitsPerDayByTrustId(this);
  };

  getRetrieveReportingStartDateByTrustId = () => {
    return retrieveReportingStartDateByTrustId(this);
  };

  getUpdateVisitById = () => {
    return updateVisitById(this);
  };

  getSendBookingNotification = () => {
    return sendBookingNotification(this);
  };

  getRetrieveVisitById = () => {
    return retrieveVisitById(this);
  };

  getMarkVisitAsComplete = () => {
    return markVisitAsComplete(this);
  };

  getUpdateOrganisation = () => {
    return updateOrganisation(this);
  };

  getCreateOrganisation = () => {
    return createOrganisation(this);
  };

  getRetrieveFacilityById = () => {
    return retrieveFacilityById(this);
  };

  getRetrieveFacilityByUuid = () => {
    return retrieveFacilityByUuid(this);
  };
  getUpdateFacilityById = () => {
    return updateFacilityById(this);
  };

  getCreateOrganisationGateway = () => {
    return createOrganisationGateway(this);
  };

  getDeleteOrganisation = () => {
    return deleteOrganisation(this);
  };

  getDeleteOrganisationGateway = () => {
    return deleteOrganisationGateway(this);
  };

  getRetrieveOrganisations = () => {
    return retrieveOrganisations(this);
  };

  getRetrieveOrganisationsGateway = () => {
    return retrieveOrganisationsGateway(this);
  };
  getRetrieveOrganisationById = () => {
    return retrieveOrganisationById(this);
  };

  getInsertManagerGateway = () => {
    return insertManagerGateway(this);
  };
  getCreateManager = () => {
    return createManager(this);
  };

  getRetrieveActiveDepartmentsByFacilityId = () => {
    return retrieveActiveDepartmentsByFacilityId(this);
  };

  getCreateDepartment = () => {
    return createDepartment(this);
  };

  getRetrieveDepartmentByUuid = () => {
    return retrieveDepartmentByUuid(this);
  };

  getUpdateDepartmentById = () => {
    return updateDepartmentById(this);
  };

  getArchiveDepartmentById = () => {
    return archiveDepartmentById(this);
  };

  /* These are the Gateway */

  getFindWardByCodeGateway = () => {
    return findWardByCode(this);
  };

  getCaptureEventGateway = () => {
    return captureEventGW(this);
  };

  getRetrieveVisitByIdGateway = () => {
    return retrieveVisitByIdGW(this);
  };

  getRetrieveOrganizations = () => {
    return retrieveOrganizationsGW(this);
  };

  getUpdateCallStatusesByWardIdGateway = () => {
    return updateCallStatusesByWardId(this);
  };

  getUpdateWardArchiveTimeByIdGateway = () => {
    return updateWardArchiveTimeById(this);
  };

  getRetrieveActiveWardsByTrustIdGW = () =>
    retrieveActiveWardsByTrustIdGW(this);

  getRetrieveHospitalVisitTotalsGateway = () => {
    return retrieveHospitalVisitTotalsGW(this);
  };

  getRetrieveAverageParticipantsInVisitGateway = () => {
    return retrieveAverageParticipantsInVisitGW(this);
  };

  getRetrieveWardsByHospitalIdGateway = () => {
    return retrieveWardsByHospitalIdGW(this);
  };

  getMarkVisitAsCompleteGateway = () => {
    return markVisitAsCompleteGW(this);
  };

  getDeleteVisitByCallIdGateway = () => {
    return deleteVisitByCallIdGW(this);
  };

  getCreateOrganizationGateway = () => {
    return createOrganisationGW(this);
  };

  getInsertVisitGateway = () => {
    return insertVisit;
  };

  getUpdateVisitStatusByDepartmentIdGateway = () => {
    return updateVisitStatusByDepartmentId(this);
  };

  getUpdateHospitalGateway = () => {
    return updateHospitalGW(this);
  };

  getRetrieveHospitalByIdGateway = () => {
    return retrieveHospitalByIdGW(this);
  };

  getRetrieveHospitalsByTrustIdGateway = () => {
    return retrieveHospitalsByTrustIdGW(this);
  };

  getRetrieveWardVisitTotalsGateway = () => {
    return retrieveWardVisitTotalsGateway(this);
  };

  getRetrieveAverageVisitTimeByTrustIdGateway = () => {
    return retrieveAverageVisitTimeByTrustIdGateway(this);
  };

  getInsertHospitalGateway = () => {
    return insertHospitalGW(this);
  };

  getCreateTrustGateway = () => {
    return createTrustGW(this);
  };

  getCreateWardGateway = () => {
    return createWardGW(this);
  };

  getUpdateTrustGateway = () => {
    return updateTrustGW(this);
  };

  getUpdateWardGateway = () => {
    return updateWardGW(this);
  };

  getUpdateWardVisitTotalsGateway = () => {
    return updateWardVisitTotals;
  };

  getRetrieveHospitalWardVisitTotalsGateway = () => {
    return retrieveHospitalWardVisitTotalsGateway(this);
  };

  getRetrieveAverageVisitsPerDayGateway = () => {
    return retrieveAverageVisitsPerDayGateway(this);
  };

  getRetrieveTrustsGateway = () => {
    return retrieveTrustsGateway(this);
  };

  getRetrieveVisitByCallIdGateway = () => {
    return retrieveVisitByCallIdGateway(this);
  };

  getRetrieveVisitsGateway = () => {
    return retrieveVisitsGateway(this);
  };

  getRetrieveWardVisitTotalsStartDateByTrustIdGateway = () => {
    return retrieveWardVisitTotalsStartDateByTrustIdGateway(this);
  };

  getUpdateVisitByIdGateway = () => {
    return updateVisitByIdGateway(this);
  };

  getVerifyAdminCodeGW = () => {
    return verifyAdminCodeGW(this);
  };

  getVerifyTrustAdminCodeGateway = () => {
    return verifyTrustAdminCodeGateway(this);
  };

  getRetrieveActiveOrganisations = () => {
    return retrieveActiveOrganisations(this);
  };

  getRetrieveActiveOrganisationsGateway = () => {
    return retrieveActiveOrganisationsGateway(this);
  };

  getRetrieveOrganisationByIdGateway = () => {
    return retrieveOrganisationByIdGateway(this);
  };

  getCreateManager = () => {
    return createManager(this);
  };

  getRetrieveActiveDepartmentsByFacilityIdGateway = () => {
    return retrieveActiveDepartmentsByFacilityIdGateway(this);
  };

  getCreateDepartmentGateway = () => {
    return createDepartmentGateway(this);
  };

  getRetrieveDepartmentByUuidGateway = () => {
    return retrieveDepartmentByUuidGateway(this);
  };

  getUpdateDepartmentByIdGateway = () => {
    return updateDepartmentByIdGateway(this);
  };

  getArchiveDepartmentByIdGateway = () => {
    return archiveDepartmentByIdGateway(this);
  };

  getRetrieveDepartmentByCodeGateway = () => {
    return retrieveDepartmentByCodeGateway(this);
  };

  getRetrieveActiveDepartmentsByOrganisationIdGateway = () => {
    return retrieveActiveDepartmentsByOrganisationIdGateway(this);
  };

  getUpdateDepartmentStatusByIdGateway = () => {
    return updateDepartmentStatusByIdGateway(this);
  };

  getRetrieveActiveDepartmentsByOrganisationIdGateway = () => {
    return retrieveActiveDepartmentsByOrganisationIdGateway(this);
  };

  getUpdateDepartmentStatusByIdGateway = () => {
    return updateDepartmentStatusByIdGateway(this);
  };

  getCreateScheduledCallGateway = () => {
    return insertScheduledCallGateway(this);
  };

  getLogEventGateway = () => {
    return logEvent(
      process.env.AZURE_FUNCTION_KEY,
      process.env.AZURE_FUNCTION_URL
    );
  };

  getRetrieveOrganizationById = () => {
    return retrieveOrganizationById;
  };

  /* These uses the MsSQL DB */

  getRetrieveManagersByOrgId = () => {
    return retrieveManagersByOrgId(this);
  };

  getRetrieveManagersByOrgIdGateway = () => {
    return retrieveManagersByOrgIdGateway(this);
  };

  getRetrieveManagerByUuid = () => {
    return retrieveManagerByUuid(this);
  };

  getRetrieveManagerByUuidGateway = () => {
    return retrieveManagerByUuidGateway(this);
  };

  getRetrieveFacilityByIdGateway = () => {
    return retrieveFacilityByIdGateway(this);
  };

  getRetrieveReportingStartDateByTrustIdGateway = () => {
    return retrieveReportingStartDateByTrustIdGW(this);
  };

  getUpdateManagerStatusByUuid = () => {
    return updateManagerStatusByUuid(this);
  };

  getUpdateManagerStatusByUuidGateway = () => {
    return updateManagerStatusByUuidGateway(this);
  };

  getArchiveManagerByUuid = () => {
    return archiveManagerByUuid(this);
  };

  getUpdateFacilityByIdGateway = () => {
    return updateFacilityByIdGateway(this);
  };

  // MsSQL database gateways
  getVerifyUserLogin = () => {
    return verifyUserLogin;
  };

  getRetrieveEmailAndHashedPassword = () => {
    return retrieveEmailAndHashedPassword;
  };

  getResetPassword = () => {
    return resetPassword;
  };

  getVerifyResetPasswordLink = () => {
    return verifyResetPasswordLink(this);
  };

  getArchiveManagerByUuidGateway = () => {
    return archiveManagerByUuidGateway(this);
  };

  getResetPassword = () => {
    return resetPassword;
  };

  getCreateManager = () => {
    return createManager(this);
  };

  getRetrieveOrganisationsGateway = () => {
    return retrieveOrganisationsGateway(this);
  };

  getRetrieveOrganisations = () => {
    return retrieveOrganisations(this);
  };

  getVerifySignUpLinkGateway = () => {
    return verifySignUpLinkGateway(this);
  };

  getVerifySignUpLink = () => {
    return verifySignUpLink(this);
  };

  getActivateManagerAndOrganisationGateway = () => {
    return activateManagerAndOrganisationGateway(this);
  };
  getActivateManagerAndOrganisation = () => {
    return activateManagerAndOrganisation(this);
  };

  getActivateOrganisationGateway = () => {
    return activateOrganisationGateway(this);
  };

  getActivateOrganisation = () => {
    return activateOrganisation(this);
  };

  getAddToUserVerificationTable = () => {
    return addToUserVerificationTable(this);
  };

  getAddToUserVerificationTableGateway = () => {
    return addToUserVerificationTableGateway(this);
  };

  getUpdateLinkStatusByHash = () => {
    return updateLinkStatusByHash(this);
  };

  getUpdateLinkStatusByHashGateway = () => {
    return updateLinkStatusByHashGateway(this);
  };

  getRetrieveManagerByEmail = () => {
    return retrieveManagerByEmail(this);
  };

  getRetrieveManagerByEmailGateway = () => {
    return retrieveManagerByEmailGateway(this);
  };

  getRetrieveFacilitiesByOrgIdGateway = () => {
    return retrieveFacilitiesByOrgIdGW(this);
  };
  getCreateFacilityGateway = () => {
    return createFacilityGateway(this);
  };
  getRetrieveFacilityByUuidGateway = () => {
    return retrieveFacilityByUuidGateway(this);
  };

  getVerifyAdminCodeGateway = () => {
    return verifyAdminCodeGateway(this);
  };

  getUpdateOrganisationGateway = () => {
    return updateOrganisationGateway(this);
  };
  
  getDeleteVisitByCallIdGateway = () => {
    return deleteVisitByCallIdGateway(this);
  };
}

export default (() => {
  let instance;

  return {
    getInstance: () => {
      if (!instance) {
        instance = new AppContainer();
        delete instance.constructor;
      }

      return instance;
    },
  };
})();
