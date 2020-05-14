import Database from "../gateways/Database";
import GovNotify from "../gateways/GovNotify";
import createVisit from "../usecases/createVisit";
import createWard from "../usecases/createWard";
import sendTextMessage from "../usecases/sendTextMessage";
import userIsAuthenticated from "../usecases/userIsAuthenticated";
import adminIsAuthenticated from "../usecases/adminIsAuthenticated";
import TokenProvider from "../providers/TokenProvider";
import retrieveWardById from "../usecases/retrieveWardById";
import verifyWardCode from "../usecases/verifyWardCode";
import verifyTrustAdminCode from "../usecases/verifyTrustAdminCode";
import retrieveVisits from "../usecases/retrieveVisits";
import retrieveVisitByCallId from "../usecases/retrieveVisitByCallId";
import verifyCallPassword from "../usecases/verifyCallPassword";
import retrieveWards from "../usecases/retrieveWards";
import updateWardVisitTotals from "../usecases/updateWardVisitTotals";
import retrieveWardVisitTotals from "../usecases/retrieveWardVisitTotals";
import updateWard from "../usecases/updateWard";
import createHospital from "../usecases/createHospital";
import retrieveHospitalsByTrustId from "../usecases/retrieveHospitalsByTrustId";
import retrieveTrustById from "../usecases/retrieveTrustById";

class AppContainer {
  getDb = () => {
    return Database.getInstance();
  };

  getCreateVisit = () => {
    return createVisit(this);
  };

  getCreateWard = () => {
    return createWard(this);
  };

  getWardById = () => {
    return retrieveWardById(this);
  };

  getTokenProvider = () => {
    return new TokenProvider(process.env.JWT_SIGNING_KEY);
  };

  getUserIsAuthenticated = () => {
    return userIsAuthenticated(this);
  };

  getAdminIsAuthenticated = () => {
    return adminIsAuthenticated(this);
  };

  getNotifyClient = () => {
    return GovNotify.getInstance();
  };

  getSendTextMessage = () => {
    return sendTextMessage(this);
  };

  getVerifyWardCode = () => {
    return verifyWardCode(this);
  };

  getVerifyTrustAdminCode = () => {
    return verifyTrustAdminCode(this);
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
    return updateWardVisitTotals(this);
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

  getRetrieveHospitalsByTrustId = () => {
    return retrieveHospitalsByTrustId(this);
  };

  getRetrieveTrustById = () => {
    return retrieveTrustById(this);
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
