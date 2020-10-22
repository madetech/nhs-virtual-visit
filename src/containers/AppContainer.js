import Database from "../gateways/Database";
import GovNotify from "../gateways/GovNotify";
import insertVisit from "../gateways/insertVisit";
import deleteVisitByCallId from "../usecases/deleteVisitByCallId";
import createWard from "../usecases/createWard";
import sendTextMessage from "../usecases/sendTextMessage";
import sendEmail from "../usecases/sendEmail";
import userIsAuthenticated from "../usecases/userIsAuthenticated";
import trustAdminIsAuthenticated from "../usecases/trustAdminIsAuthenticated";
import adminIsAuthenticated from "../usecases/adminIsAuthenticated";
import TokenProvider from "../providers/TokenProvider";
import retrieveWardById from "../usecases/retrieveWardById";
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
import retrieveTrustById from "../usecases/retrieveTrustById";
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
import updateWardVisitTotals from "../gateways/updateWardVisitTotals";

import CallIdProvider from "../providers/CallIdProvider";
import RandomIdProvider from "../providers/RandomIdProvider";

class AppContainer {
  getDb = () => {
    return Database.getInstance();
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
    return retrieveWardById(this);
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
    return retrieveTrustById(this);
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

  getInsertVisitGateway = () => {
    return insertVisit;
  };

  getUpdateWardVisitTotalsGateway = () => {
    return updateWardVisitTotals;
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
