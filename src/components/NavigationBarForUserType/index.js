import React from "react";
import WardsNavigationBar from "../WardsNavigationBar";
import TrustAdminsNavigationBar from "../TrustAdminsNavigationBar";
import { WARD_STAFF, TRUST_ADMIN } from "../../helpers/userTypes";

const NavigationBarForUserType = ({ userType }) => {
  switch (userType) {
    case WARD_STAFF:
      return <WardsNavigationBar />;
    case TRUST_ADMIN:
      return <TrustAdminsNavigationBar />;
    default:
      return null;
  }
};

export default NavigationBarForUserType;
