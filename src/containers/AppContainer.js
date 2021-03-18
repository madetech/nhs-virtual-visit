//import Database from "../gateways/Database";
import GovNotify from "../gateways/GovNotify";
import logEvent from "../gateways/logEvent";
import CallIdProvider from "../providers/CallIdProvider";
import RandomIdProvider from "../providers/RandomIdProvider";

/* Usecases  */
import deleteVisitByCallId from "../usecases/deleteVisitByCallId";
import sendTextMessage from "../usecases/sendTextMessage";
import sendEmail from "../usecases/sendEmail";
import userIsAuthenticated from "../usecases/userIsAuthenticated";
import adminIsAuthenticated from "../usecases/adminIsAuthenticated";
import organisationAdminIsAuthenticated from "../usecases/organisationIsAuthenticated";
import TokenProvider from "../providers/TokenProvider";
import verifyAdminCode from "../usecases/verifyAdminCode";
import retrieveVisits from "../usecases/retrieveVisits";
import retrieveVisitByCallId from "../usecases/retrieveVisitByCallId";
import verifyCallPassword from "../usecases/verifyCallPassword";
import validateEmailAddress from "../usecases/validateEmailAddress";
import validateMobileNumber from "../usecases/validateMobileNumber";
import regenerateToken from "../usecases/regenerateToken";
import captureEvent from "../usecases/captureEvent";
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
import verifyUserLogin from "../usecases/verifyUserLogin";
import retrieveDepartmentById from "../usecases/retrieveDepartmentById";
import retrieveActiveManagersByOrgId from "../usecases/retrieveActiveManagersByOrgId";
import resetPassword from "../usecases/resetPassword";
import retrieveActiveDepartmentsByOrganisationId from "../usecases/retrieveActiveDepartmentsByOrganisationId";
import retrieveDepartmentByCode from "../usecases/retrieveDepartmentByCode";
import createVisit from "../usecases/createVisit";
import updateUserVerificationToVerified from "../usecases/updateUserVerificationToVerified";
import retrieveTotalVisitsByStatusAndOrgId from "../usecases/retrieveTotalVisitsByStatusAndOrgId";
import retrieveTotalVisitsByStatusAndFacilityId from "../usecases/retrieveTotalVisitsByStatusAndFacilityId";
import retrieveTotalBookedVisitsForDepartmentsByFacilityId from "../usecases/retrieveTotalBookedVisitsForDepartmentsByFacilityId";
import retrieveTotalBookedVisitsForFacilitiesByOrgId from "../usecases/retrieveTotalBookedVisitsForFacilitiesByOrgId";
import deleteRecipientInformationForPii from "../usecases/deleteRecipientInformationForPii";
import updateScheduledCallStartTimeByCallUuid from "../usecases/updateScheduledCallStartTimeByCallUuid";
import retrieveTotalCompletedVisitsByOrgOrFacilityId from "../usecases/retrieveTotalCompletedVisitsByOrgOrFacilityId";

/* Gateways */
import MsSQL from "../gateways/MsSQL";
import verifyUserLoginGateway from "../gateways/MsSQL/verifyUserLogin";
import resetPasswordGateway from "../gateways/MsSQL/resetPassword";
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
import verifyTimeSensitiveLinkGateway from "../gateways/MsSQL/verifyTimeSensitiveLink";
import retrieveManagerByEmailGateway from "../gateways/MsSQL/retrieveManagerByEmail";
import retrieveFacilitiesByOrgIdGateway from "../gateways/MsSQL/retrieveFacilitiesByOrgId";
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
import updateOrganisationGateway from "../gateways/MsSQL/updateOrganisation";
import deleteVisitByCallIdGateway from "../gateways/MsSQL/deleteVisitByCallId";
import retrieveActiveManagersByOrgIdGateway from "../gateways/MsSQL/retrieveActiveManagersByOrgId";
import updateVisitStatusByCallIdGateway from "../gateways/MsSQL/updateVisitStatusByCallId";
import insertVisitGateway from "../gateways/MsSQL/insertVisit";
import retrieveDepartmentByIdGateway from "../gateways/MsSQL/retrieveDepartmentById";
import retrieveVisitByIdGateway from "../gateways/MsSQL/retrieveScheduledCallById";
import captureEventGateway from "../gateways/MsSQL/captureEvent";
import retrieveVisitByCallIdGateway from "../gateways/MsSQL/retrieveScheduledCallByUuid";
import retrieveVisitsGateway from "../gateways/MsSQL/retrieveVisits";
import updateVisitByIdGateway from "../gateways/MsSQL/updateVisitById";
import verifyTimeSensitiveLink from "../usecases/verifyTimeSensitiveLink";
import activateManagerAndOrganisation from "../usecases/activateManagerAndOrganisation";
import activateManagerAndOrganisationGateway from "../gateways/MsSQL/activateManagerAndOrganisation";
import activateOrganisation from "../usecases/activateOrganisation";
import activateOrganisationGateway from "../gateways/MsSQL/activateOrganisation";
import addToUserVerificationTable from "../usecases/addToUserVerificationTable";
import addToUserVerificationTableGateway from "../gateways/MsSQL/addToUserVerificationTable";
import updateVisitStatusByDepartmentId from "../gateways/MsSQL/updateVisitStatusByDepartmentId";
import updateVisitStatusByCallId from "../gateways/MsSQL/updateVisitStatusByCallId";
import updateUserVerificationToVerifiedGateway from "../gateways/MsSQL/updateUserVerificationToVerified";
import retrieveTotalVisitsByStatusAndOrgIdGW from "../gateways/MsSQL/retrieveTotalVisitsByStatusAndOrgId.js";
import retrieveTotalVisitsByStatusAndFacilityIdGW from "../gateways/MsSQL/retrieveTotalVisitsByStatusAndFacilityId"
import retrieveTotalBookedVisitsForDepartmentsByFacilityIdGW from "../gateways/MsSQL/retrieveTotalBookedVisitsForDepartmentsByFacilityId";
import retrieveTotalBookedVisitsForFacilitiesByOrgIdGW from "../gateways/MsSQL/retrieveTotalBookedVisitsForFacilitiesByOrgId";
import updateScheduledCallStartTimeByCallUuidGW from "../gateways/MsSQL/updateScheduledCallStartTimeByCallUuid";
import retrieveTotalCompletedVisitsByOrgOrFacilityIdGW from "../gateways/MsSQL/retrieveTotalCompletedVisitsByOrgOrFacilityId";

import logger from "../../logger"
import deleteRecipientInformationForPiiGateway from "../gateways/MsSQL/deleteRecipientInformationForPii";

class AppContainer {

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

  getTokenProvider = () => {
    return new TokenProvider(process.env.JWT_SIGNING_KEY);
  };

  getUserIsAuthenticated = () => {
    return userIsAuthenticated(this);
  };

  getAdminIsAuthenticated = () => {
    return adminIsAuthenticated(this);
  };

  getOrganisationAdminIsAuthenticated = () => {
    return organisationAdminIsAuthenticated(this);
  };

  getSendTextMessage = () => {
    return sendTextMessage(this);
  };

  getSendEmail = () => {
    return sendEmail(this);
  };

  getVerifyAdminCode = () => {
    return verifyAdminCode(this);
  };

  getCreateVisit = () => {
    return createVisit(this);
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

  getCreateFacility = () => {
    return createFacility(this);
  };

  getRetrieveFacilitiesByOrgId = () => {
    return retrieveFacilitiesByOrgId(this);
  };

  getValidateEmailAddress = () => {
    return validateEmailAddress(this);
  };

  getValidateMobileNumber = () => {
    return validateMobileNumber(this);
  };
  getRegenerateToken = () => {
    return regenerateToken(this);
  };

  getCaptureEvent = () => {
    return captureEvent(this);
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

  getRetrieveActiveDepartmentsByOrganisationId = () => {
    return retrieveActiveDepartmentsByOrganisationId(this);
  };

  getRetrieveDepartments = () => {
    return retrieveActiveDepartmentsByOrganisationId(this);
  };

  getCreateDepartment = () => {
    return createDepartment(this);
  };

  getRetrieveDepartmentById = () => {
    return retrieveDepartmentById(this);
  };

  getRetrieveDepartmentByUuid = () => {
    return retrieveDepartmentByUuid(this);
  };

  getRetrieveDepartmentByCode = () => {
    return retrieveDepartmentByCode(this);
  };

  getUpdateDepartmentById = () => {
    return updateDepartmentById(this);
  };

  getArchiveDepartmentById = () => {
    return archiveDepartmentById(this);
  };

  getRetrieveActiveManagersByOrgId = () => {
    return retrieveActiveManagersByOrgId(this);
  };

  getResetPassword = () => {
    return resetPassword(this);
  };

  getUpdateScheduledCallStartTimeByCallUuid = () => {
    return updateScheduledCallStartTimeByCallUuid(this);
  }

  /* These are the Gateway */

  getCaptureEventGateway = () => {
    return captureEventGateway(this);
  };

  getRetrieveVisitByIdGateway = () => {
    return retrieveVisitByIdGateway(this);
  };

  getDeleteVisitByCallIdGateway = () => {
    return deleteVisitByCallIdGateway(this);
  };

  getInsertVisitGateway = () => {
    return insertVisitGateway(this);
  };

  getUpdateVisitStatusByDepartmentIdGateway = () => {
    return updateVisitStatusByDepartmentId(this);
  };

  getUpdateVisitStatusByCallIdGateway = () => {
    return updateVisitStatusByCallId(this);
  };

  getRetrieveVisitByCallIdGateway = () => {
    return retrieveVisitByCallIdGateway(this);
  };

  getRetrieveVisitsGateway = () => {
    return retrieveVisitsGateway(this);
  };

  getUpdateVisitByIdGateway = () => {
    return updateVisitByIdGateway(this);
  };

  getVerifyAdminCodeGateway = () => {
    return verifyAdminCodeGateway(this);
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

  getRetrieveDepartmentByIdGateway = () => {
    return retrieveDepartmentByIdGateway(this);
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


  getRetrieveActiveDepartmentsByOrganisationIdGateway = () => {
    return retrieveActiveDepartmentsByOrganisationIdGateway(this);
  };

  getCreateScheduledCallGateway = () => {
    return insertVisitGateway(this);
  };

  getRetrieveActiveManagersByOrgIdGateway = () => {
    return retrieveActiveManagersByOrgIdGateway(this);
  };

  getRetrieveTotalBookedVisitsByOrgIdGateway = () => {
    return retrieveTotalVisitsByStatusAndOrgIdGW(this);
  };

  getRetrieveTotalVisitsByStatusAndFacilityIdGateway = () => {
    return retrieveTotalVisitsByStatusAndFacilityIdGW(this);
  }
  
  getUpdateScheduledCallStartTimeByCallUuidGateway = () => {
    return updateScheduledCallStartTimeByCallUuidGW(this);
  }

  getLogEventGateway = () => {
    return logEvent(
      process.env.AZURE_FUNCTION_KEY,
      process.env.AZURE_FUNCTION_URL
    );
  };

   getRetrieveTotalVisitsByStatusAndOrgId = () => {
    return retrieveTotalVisitsByStatusAndOrgId(this);
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

  getVerifyUserLogin = () => {
    return verifyUserLogin(this);
  };
  // MsSQL database gateways
  getVerifyUserLoginGateway = () => {
    return verifyUserLoginGateway(this);
  };

  getResetPasswordGateway = () => {
    return resetPasswordGateway(this);
  };

  getArchiveManagerByUuidGateway = () => {
    return archiveManagerByUuidGateway(this);
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

  getVerifyTimeSensitiveLinkGateway = () => {
    return verifyTimeSensitiveLinkGateway(this);
  };

  getVerifyTimeSensitiveLink = () => {
    return verifyTimeSensitiveLink(this);
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

  getRetrieveManagerByEmail = () => {
    return retrieveManagerByEmail(this);
  };

  getRetrieveManagerByEmailGateway = () => {
    return retrieveManagerByEmailGateway(this);
  };

  getRetrieveFacilitiesByOrgIdGateway = () => {
    return retrieveFacilitiesByOrgIdGateway(this);
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

  getUpdateVisitStatusByCallIdGateway = () => {
    return updateVisitStatusByCallIdGateway(this);
  };

  getUpdateUserVerificationToVerified = () => {
    return updateUserVerificationToVerified(this);
  };

  getUpdateUserVerificationToVerifiedGateway = () => {
    return updateUserVerificationToVerifiedGateway(this);
  };

  getDeleteRecipientInformationForPii = () => {
    return deleteRecipientInformationForPii(this);
  };
  
  getDeleteRecipientInformationForPiiGateway = () => {
    return deleteRecipientInformationForPiiGateway(this);
  }
  
  getRandomIdProvider = () => {
    return new RandomIdProvider();
  };

  getCallIdProvider = (provider, callTime = null) => {
    return new CallIdProvider(provider, callTime);
  };

  getRetrieveTotalBookedVisitsForFacilitiesByOrgId = () => {
    return retrieveTotalBookedVisitsForFacilitiesByOrgId(this);
  };

  getRetrieveTotalBookedVisitsForFacilitiesByOrgIdGateway = () => {
    return retrieveTotalBookedVisitsForFacilitiesByOrgIdGW(this);
  };

  getRetrieveTotalVisitsByStatusAndOrgIdGateway = () => {
    return retrieveTotalVisitsByStatusAndOrgIdGW(this);
  };

  getRetrieveTotalVisitsByStatusAndFacilityId = () => {
    return retrieveTotalVisitsByStatusAndFacilityId(this);
  }

  getRetrieveDepartmentVisitTotalsStartDateByOrganisationId = () => () => ({
    error: null,
    startDate: 1,
  });

  getRetrieveReportingStartDateByOrganisationId = () => () => ({
    error: null,
    startDate: 1,
  });

  getRetrieveAverageVisitTimeByOrganisationId = () => () => ({
    error: null,
    averageVisitTime: 1,
  });

  getRetrieveAverageVisitsPerDayByOrganisationId = () => () => ({
    error: null,
    averageVisitsPerDay: 1,
  });

  getRetrieveTotalBookedVisitsForDepartmentsByFacilityId = () => {
    return retrieveTotalBookedVisitsForDepartmentsByFacilityId(this);
  }

  getRetrieveTotalBookedVisitsForDepartmentsByFacilityIdGateway = () => {
    return retrieveTotalBookedVisitsForDepartmentsByFacilityIdGW(this);
  }

  getRetrieveTotalCompletedVisitsByOrgOrFacilityId = () => {
    return retrieveTotalCompletedVisitsByOrgOrFacilityId(this);
  };

  getRetrieveTotalCompletedVisitsByOrgOrFacilityIdGateway = () => {
    return retrieveTotalCompletedVisitsByOrgOrFacilityIdGW(this);
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

      instance.logger = logger

      return Object.assign(instance);
    },
  };
})();