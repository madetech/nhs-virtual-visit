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
import retrieveSurveyUrlByCallId from "../usecases/retrieveSurveyUrlByCallId";
import retrieveSupportUrlByCallId from "../usecases/retrieveSupportUrlByCallId";
import updateVisitById from "../usecases/updateVisitById";
import sendBookingNotification from "../usecases/sendBookingNotification";
import retrieveVisitById from "../usecases/retrieveVisitById";
import markVisitAsComplete from "../usecases/markVisitAsComplete";
import updateTrust from "../usecases/updateTrust";
import createOrganization from "../usecases/createOrganization";
import retrieveOrganizations from "../usecases/retrieveOrganizations";

/* GW MSSQL*/
import MsSQL from "../gateways/MsSQL";
import retrieveManagersByOrgId from "../gateways/MsSQL/retrieveManagersByOrgId";
import retrieveManagerByUuid from "../gateways/MsSQL/retrieveManagerByUuid";
import updateManagerByUuid from "../gateways/MsSQL/updateManagerByUuid";
import archiveManagerByUuid from "../gateways/MsSQL/archiveManagerByUuid";
import verifyUserLogin from "../gateways/MsSQL/verifyUserLogin";
import retrieveEmailAndHashedPassword from "../gateways/MsSQL/retrieveEmailAndHashedPassword";
import resetPassword from "../gateways/MsSQL/resetPassword";
import verifyResetPasswordLink from "../gateways/MsSQL/verifyResetPasswordLink";

/* GW Imports */
import findWardByCode from "../gateways/PostgreSQL/findWardByCode";
import insertVisit from "../gateways/PostgreSQL/insertVisit";
import updateCallStatusesByWardId from "../gateways/PostgreSQL/updateCallStatusesByWardId";
import updateWardArchiveTimeById from "../gateways/PostgreSQL/updateWardArchiveTimeById";
import updateWardVisitTotals from "../gateways/PostgreSQL/updateWardVisitTotals";
import retrieveWardById from "../gateways/PostgreSQL/retrieveWardById";
import retrieveTrustById from "../gateways/PostgreSQL/retrieveTrustById";
import retrieveOrganizationById from "../gateways/PostgreSQL/retrieveOrganizationById";

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
import CallIdProvider from "../providers/CallIdProvider";
import RandomIdProvider from "../providers/RandomIdProvider";
import MsSQL from "../gateways/MsSQL";
import insertHospital from "../gateways/PostgreSQL/insertHospital";
import deleteVisitByCallIdGW from "../gateways/PostgreSQL/deleteVisitByCallId";
import retrieveManagersByOrgId from "../usecases/retrieveManagersByOrgId";
import retrieveManagersByOrgIdGateway from "../gateways/MsSQL/retrieveManagersByOrgId";
import retrieveManagerByUuid from "../usecases/retrieveManagerByUuid";
import retrieveManagerByUuidGateway from "../gateways/MsSQL/retrieveManagerByUuid";
import updateManagerStatusByUuid from "../usecases/updateManagerStatusByUuid";
import updateManagerStatusByUuidGateway from "../gateways/MsSQL/updateManagerStatusByUuid";
import archiveManagerByUuid from "../usecases/archiveManagerByUuid";
import archiveManagerByUuidGateway from "../gateways/MsSQL/archiveManagerByUuid";

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

  getUpdateHospital = () => {
    return updateHospital(this);
  };

  getRetrieveHospitalsByTrustId = () => {
    return retrieveHospitalsByTrustId(this);
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

  getRetrieveSurveyUrlByCallId = () => {
    return retrieveSurveyUrlByCallId(this);
  };

  getRetrieveSupportUrlByCallId = () => {
    return retrieveSupportUrlByCallId(this);
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

  getUpdateTrust = () => {
    return updateTrust(this);
  };

  getCreateOrganization = () => {
    return createOrganization(this);
  };

  getRetrieveOrganizations = () => {
    return retrieveOrganizations(this);
  };

  getRetrieveOrganizationById = () => {
    return retrieveOrganizationById;
  };

  /* These are the Gateway */

  getFindWardByCodeGateway = () => {
    return findWardByCode(this);
  };

  getUpdateCallStatusesByWardIdGateway = () => {
    return updateCallStatusesByWardId(this);
  };

  getUpdateWardArchiveTimeByIdGateway = () => {
    return updateWardArchiveTimeById(this);
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

  getUpdateHospitalGateway = () => {
    return updateHospitalGW(this);
  };

  getRetrieveHospitalByIdGateway = () => {
    return retrieveHospitalByIdGW(this);
  };

  getRetrieveHospitalsByTrustIdGateway = () => {
    return retrieveHospitalsByTrustIdGW(this);
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

  getLogEventGateway = () => {
    return logEvent(
      process.env.AZURE_FUNCTION_KEY,
      process.env.AZURE_FUNCTION_URL
    );
  };

  /* These uses the MsSQL DB */

  getRetrieveManagersByOrgId = () => {
    return retrieveManagersByOrgId(this);
  };

  getRetrieveManagersByOrgIdGateway = () => {
    return retrieveManagersByOrgIdGateway;
  };

  getRetrieveManagerByUuid = () => {
    return retrieveManagerByUuid(this);
  };
  getRetrieveManagerByUuidGateway = () => {
    return retrieveManagerByUuidGateway;
  };

  getUpdateManagerStatusByUuid = () => {
    return updateManagerStatusByUuid(this);
  };

  getUpdateManagerStatusByUuidGateway = () => {
    return updateManagerStatusByUuidGateway;
  };
  å;
  getArchiveManagerByUuid = () => {
    return archiveManagerByUuid(this);
  };

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
  }
  getArchiveManagerByUuidGateway = () => {
    return archiveManagerByUuidGateway;
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
